import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Base from "../base/base";
import MainPage from "../../pages/main-page/main-page";
import AddBookPage from "../../pages/add-book-page/add-book-page";
import { getDocs, collection, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import database from "../../firebase";
import { FILTER_RATING } from "../../utils/constants";
import { TFilters, IContext } from "../../utils/types";

export const Context = React.createContext<IContext | null>(null);

const App: FC = () => {
    const [data, setData] = React.useState<QueryDocumentSnapshot<DocumentData>[]>();
    const [filter, setFilter] = React.useState<TFilters>(FILTER_RATING);
    const [isLoading, setLoading] = React.useState<boolean>(true);

    const booksCollection = collection(database, "collection");
    React.useEffect(() => {
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

export default App;
