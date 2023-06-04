import { useContext, useEffect, useState, FC, useCallback } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Loader } from "../../components/main-page-loader/loader";
import { BookView } from "../../components/book-view/book-view";
import { Context } from "../../components/app/app";
import { FILTER_AUTHOR } from "../../utils/constants";
import { getRecommendation, sortDataByFilter, sortByChars, sortByNumbers, sortDocs, generateSubtitle } from "../../utils/helpers";
import { IContext, TData } from "../../utils/types";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const MainPage: FC = () => {
    const { data, setData, isLoading, filter } = useContext(Context) as IContext;
    const [dataKeys, setDataKeys] = useState<string[] | null>(null);
    const [dataValues, setDataValues] = useState<{ data: DocumentData; id: string }[][] | null>(null);
    const [recommedation, setRecomendation] = useState<{ data: DocumentData; id: string } | null>(null);
    const [isSorting, setSorting] = useState(true);

    const handleDeleteItem = useCallback(
        (id: string) => {
            setData((data as QueryDocumentSnapshot<DocumentData>[]).filter((doc) => doc.id !== id));
        },
        [data, setData]
    );

    useEffect(() => {
        setSorting(true);
        if (data && data.length > 0) {
            const currentDataDict = sortDataByFilter(filter, data);
            const keys = [...(currentDataDict.keys() as any)].sort(filter === FILTER_AUTHOR ? sortByChars : sortByNumbers);
            const values: { data: DocumentData; id: string }[][] = [];
            keys.forEach((key) => {
                const currentValues = currentDataDict.get(key)?.sort(sortDocs);
                if (currentValues) {
                    values.push(currentValues);
                }
            });
            setDataKeys(keys.map((key) => generateSubtitle(filter, key)) as string[]);
            setDataValues(values);
            setRecomendation(getRecommendation(data));
        }
        setSorting(false);
    }, [filter, data]);

    if (isLoading || isSorting) {
        return <Loader />;
    }

    return (
        <Box textAlign="center" sx={{ width: "100%", overflowY: "auto" }}>
            <Typography mb={2} variant="h2" component="div">
                Книги
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {data && data.length === 0 && (
                <Typography mb={2} variant="h5" component="p">
                    Книг не найдено
                </Typography>
            )}
            {recommedation && (
                <>
                    <Typography mb={1} variant="h5" component="p">
                        Рекомендация
                    </Typography>
                    <Box display="flex" sx={{ justifyContent: "center" }}>
                        <BookView handleDeleteItem={handleDeleteItem} data={recommedation.data as TData} id={recommedation.id} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                </>
            )}
            {dataValues &&
                dataKeys &&
                dataKeys.map((key, index) => {
                    return (
                        <>
                            <Typography variant="h5" component="p">
                                {key}
                            </Typography>
                            <Box sx={{ flexWrap: "wrap" }} display="flex">
                                {dataValues[index].map((element) => (
                                    <BookView key={element.id} handleDeleteItem={handleDeleteItem} data={element.data as TData} id={element.id} />
                                ))}
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                        </>
                    );
                })}
        </Box>
    );
};
