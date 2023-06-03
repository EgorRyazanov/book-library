import { Box, Typography, Rating, IconButton, Divider, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import database from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "../modal/modal";
import BookViewModal from "../book-view-modal/book-view-modal";
import { TData } from "../../utils/types";

interface IBookView {
    data: TData;
    id: string;
    handleDeleteItem: (id: string) => void;
}

const BookView: FC<IBookView> = ({ data, id, handleDeleteItem }) => {
    const [modalActive, setModalActive] = useState(false);
    const handleToggleModal = () => {
        setModalActive(!modalActive);
    };

    const navigate = useNavigate();
    const [isDeleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        const bookDoc = doc(database, "collection", id);
        setDeleting(true);
        try {
            await deleteDoc(bookDoc);
            handleDeleteItem(id);
            toast.success("Книга успешно удалена", { autoClose: 3000 });
        } catch {
            toast.error("Не удалось удалить книгу", { autoClose: 3000 });
        } finally {
            setTimeout(() => setDeleting(false), 5000);
        }
    };

    if (isDeleting) {
        return (
            <Box sx={{ display: "flex", width: 250, minHeight: 200, justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    m: 3,
                    p: 2,
                    width: 250,
                    height: 250,
                    position: "relative",
                    textAlign: "left",
                    border: "1px solid grey",
                    boxShadow: "4px 4px 8px 0px rgba(34, 60, 80, 0.2)",
                }}
            >
                <Typography sx={{ justifyContent: "flex-start", wordWrap: "break-word" }} variant="body1" component="p">
                    {`Название: ${data.title}`}
                </Typography>
                <Divider />
                {}
                <Typography noWrap sx={{ justifyContent: "flex-start" }} variant="body1" component="p">
                    {`Авторы: ${data.authors.join(", ")}`}
                </Typography>
                <Divider />
                {data.isbn && (
                    <>
                        <Typography sx={{ justifyContent: "flex-start" }} variant="body1" component="p">
                            {`ISBN: ${data.isbn}`}
                        </Typography>
                        <Divider />
                    </>
                )}
                {data.publishedAt && (
                    <>
                        <Typography sx={{ justifyContent: "flex-start" }} variant="body1" component="p">
                            {`Издана в ${data.publishedAt} году`}
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                    </>
                )}
                <Rating sx={{ mb: 4 }} name="read-only" value={data.rating} readOnly />
                <Box sx={{ position: "absolute", top: "80%", left: "40%" }} display="flex">
                    <Button onClick={handleToggleModal} variant="text">
                        Подробнее
                    </Button>
                    <IconButton sx={{ alignItems: "flex-start", height: 50 }} onClick={() => navigate(`edit/${id}`)} size="large" edge="start">
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ alignItems: "flex-start", height: 50 }} onClick={handleDelete} size="large" edge="start">
                        <DeleteOutlineIcon />
                    </IconButton>
                </Box>
            </Box>
            {modalActive && (
                <Modal handleToggleModal={handleToggleModal}>
                    <BookViewModal data={data} />
                </Modal>
            )}
        </>
    );
};

export default BookView;
