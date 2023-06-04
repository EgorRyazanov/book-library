import { FC, createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Base } from "../base/base";
import { MainPage } from "../../pages/main-page/main-page";
import { AddBookPage } from "../../pages/add-book-page/add-book-page";
import { getDocs, collection, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import database from "../../firebase";
import { FILTER_RATING } from "../../utils/constants";
import { TFilters, IContext } from "../../utils/types";

export const Context = createContext<IContext | null>(null);

export const App: FC = () => {
    const [data, setData] = useState<QueryDocumentSnapshot<DocumentData>[]>();
    const [filter, setFilter] = useState<TFilters>(FILTER_RATING);
    const [isLoading, setLoading] = useState<boolean>(true);

    const booksCollection = collection(database, "collection");
    useEffect(() => {
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
    }, []);

    return (
        <Context.Provider value={{ data, setData, setFilter, filter, isLoading, setLoading }}>
            <Routes>
                <Route path="/" element={<Base />}>
                    <Route index element={<MainPage />} />
                </Route>
                <Route path="edit/:id" element={<AddBookPage />} />
                <Route path="add" element={<AddBookPage />} />
            </Routes>
        </Context.Provider>
    );
};
