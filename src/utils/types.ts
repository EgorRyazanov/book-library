import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export type TFilters = "year" | "author" | "rating";

export type TData = {
    rating: number;
    isbn: string | null;
    title: string;
    publishedAt: number | null;
    authors: Array<string>;
};

export interface IContext {
    data: QueryDocumentSnapshot<DocumentData>[] | undefined;
    setData: (x: QueryDocumentSnapshot<DocumentData>[] | undefined) => void;
    setFilter: (x: TFilters) => void;
    filter: TFilters;
    isLoading: Boolean;
    setLoading: (x: boolean) => void;
}

export type TFormValues = {
    title: string;
    authors: string;
    isbn: string;
    publishedAt: number | "";
};

export type TSortedDataByFilterKeys = {};
