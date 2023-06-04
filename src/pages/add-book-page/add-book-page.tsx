import { FC, useState, useContext, useRef, useEffect } from "react";
import { Button, IconButton, Typography, Rating, TextField, Box, Skeleton } from "@mui/material";
import { useForm, Controller, useFormState, SubmitHandler } from "react-hook-form";
import { titleValidation, isbnValidation, timeValidation } from "../../utils/validation";
import styles from "./add-book-page.module.css";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import uuid from "react-uuid";
import { addDoc, collection, updateDoc, getDocs, doc } from "firebase/firestore";
import database from "../../firebase.js";
import { toast } from "react-toastify";
import { Context } from "../../components/app/app";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormLoader } from "../../components/form-loader/form.loader";
import { IContext, TFormValues } from "../../utils/types.js";

export const AddBookPage: FC = () => {
    const { handleSubmit, control, reset, setValue } = useForm<TFormValues>({ mode: "onSubmit" });
    const [isPosting, setPosting] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const authorRef = useRef<HTMLInputElement | null>(null);
    const [authors, setAuthors] = useState<{ name: string; id: string }[]>([]);
    const { errors } = useFormState({
        control,
    });
    const { id } = useParams();
    const { data, isLoading, setLoading, setData } = useContext(Context) as IContext;
    const booksCollection = collection(database, "collection");
    const navigate = useNavigate();
    useEffect(() => {
        if (id && data && data?.length > 0) {
            const doc = data.filter((doc) => doc.id === id)[0].data();
            reset({ title: doc.title, publishedAt: doc.publishedAt, authors: "", isbn: doc.isbn });
            setRating(doc.rating);
            setAuthors(
                doc.authors.map((element: string) => {
                    return { name: element, id: uuid() };
                })
            );
        }
    }, [data]);
    const onSubmit: SubmitHandler<TFormValues> = async (data) => {
        setPosting(true);
        const info = {
            ...data,
            rating,
            authors: authors.map((element) => element.name),
            isbn: data.isbn || null,
            publishedAt: data.publishedAt || null,
        };
        if (id) {
            try {
                const bookDoc = doc(database, "collection", id);
                await updateDoc(bookDoc, info);
                toast.success("Книга успешно отредактировано", { autoClose: 3000 });
                navigate("/", { replace: true });
            } catch {
                toast.error("Не удалось отредактировать книгу", { autoClose: 3000 });
            }
        } else {
            try {
                await addDoc(booksCollection, info);
                toast.success("Книга успешно добавлена", { autoClose: 3000 });
                reset({ title: "", publishedAt: "", authors: "", isbn: "" });
                setRating(0);
                setAuthors([]);
            } catch (e) {
                toast.error("Не удалось добавить книгу", { autoClose: 3000 });
            }
        }
        setPosting(false);
        const getBooks = async () => {
            try {
                const info = await getDocs(booksCollection);
                setData(info.docs);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        getBooks();
    };

    if (isLoading) {
        return <FormLoader styles={styles.form__container} />;
    }

    return (
        <div className={styles.form__container}>
            <Typography variant="h4" component="div">
                {id ? "Отредактируйте книгу" : "Добавьте книгу"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="title"
                    rules={titleValidation}
                    render={({ field }) => (
                        <TextField
                            label="Название"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                            fullWidth={true}
                            type="text"
                            size="small"
                            margin="normal"
                            disabled={isPosting}
                            error={!!errors?.title?.message}
                            helperText={errors?.title?.message as string | null}
                            defaultValue=""
                        />
                    )}
                />

                <Box sx={{ position: "relative" }}>
                    <Typography variant="body2" sx={{ color: "#9E9E9E", mb: -1 }}>
                        Для добавления автора нажмите на плюсик
                    </Typography>
                    <Controller
                        control={control}
                        name="authors"
                        rules={{
                            validate: () => {
                                if (authors.length === 0) {
                                    return "Должен быть хотя бы 1 автор";
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                inputRef={authorRef}
                                label="Автор"
                                onChange={(e) => field.onChange(e)}
                                value={field.value}
                                fullWidth={true}
                                size="small"
                                type="text"
                                margin="normal"
                                disabled={isPosting}
                                error={!!errors.authors?.message}
                                helperText={errors?.authors?.message as string | null}
                            />
                        )}
                    />
                    <IconButton
                        sx={{ position: "absolute", left: "102%", top: "40%" }}
                        onClick={() => {
                            if (authorRef.current) {
                                const value = authorRef.current?.value;
                                if (value && value.replace(/^\s+|[^A-ZА-ЯЁ\s]/gi, "").trim().length > 0) {
                                    setValue("authors", "", { shouldValidate: false });
                                    setAuthors([...authors, { name: value, id: uuid() }]);
                                }
                            }
                        }}
                        size="small"
                        edge="start"
                    >
                        <AddIcon sx={{ color: "#66BB6A" }} />
                    </IconButton>
                </Box>
                {authors.map((author) => {
                    return (
                        <Box key={author.id} sx={{ position: "relative", mb: 1 }}>
                            <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
                                &bull; {author.name}
                            </Typography>
                            <IconButton
                                sx={{ position: "absolute", left: "102%", top: "-40%" }}
                                onClick={() => {
                                    setAuthors(authors.filter((element) => author.id !== element.id));
                                }}
                                size="small"
                                edge="start"
                            >
                                <ClearIcon sx={{ color: "#FF5722" }} />
                            </IconButton>
                        </Box>
                    );
                })}
                <Controller
                    control={control}
                    name="isbn"
                    rules={isbnValidation}
                    render={({ field }) => (
                        <TextField
                            label="ISBN"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                            fullWidth={true}
                            size="small"
                            margin="normal"
                            disabled={isPosting}
                            className="auth-form__input"
                            error={!!errors.isbn?.message}
                            helperText={errors?.isbn?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="publishedAt"
                    rules={timeValidation}
                    render={({ field }) => (
                        <TextField
                            label="Год издания"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                            fullWidth={true}
                            type="number"
                            size="small"
                            margin="normal"
                            disabled={isPosting}
                            className="auth-form__input"
                            error={!!errors?.publishedAt?.message}
                            helperText={errors?.publishedAt?.message}
                        />
                    )}
                />
                <Rating
                    name="simple-controlled"
                    value={rating}
                    disabled={isPosting}
                    onChange={(event, newValue) => {
                        setRating(newValue as number);
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth={true}
                    disabled={isPosting}
                    disableElevation={true}
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {id ? "Отредактировать" : "Добавить"}
                </Button>
            </form>
            <div>
                <Link className={styles.link} to={"/"}>
                    <Typography variant="subtitle1" component="span">
                        Вернуться на главную страницу
                    </Typography>
                </Link>
            </div>
        </div>
    );
};
