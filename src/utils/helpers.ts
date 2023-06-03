import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { FILTER_RATING, FILTER_YEAR, FILTER_AUTHOR } from "./constants";
import { TFilters } from "./types";

export const sortDataByFilter = (filter: TFilters, data: QueryDocumentSnapshot<DocumentData>[]) => {
    const dict = new Map<number | string, { data: DocumentData; id: string }[]>();
    if (filter === FILTER_RATING) {
        data.forEach((element) => {
            const info = { data: element.data(), id: element.id };
            if (!dict.has(info.data.rating)) {
                dict.set(info.data.rating, [info]);
            } else {
                dict.set(info.data.rating, [...(dict.get(info.data.rating) as { data: DocumentData; id: string }[]), info]);
            }
        });
    } else if (filter === FILTER_YEAR) {
        data.forEach((element) => {
            const info = { data: element.data(), id: element.id };
            if (!dict.has(info.data.publishedAt)) {
                dict.set(info.data.publishedAt, [info]);
            } else {
                dict.set(info.data.publishedAt, [...(dict.get(info.data.publishedAt) as { data: DocumentData; id: string }[]), info]);
            }
        });
    } else if (filter === FILTER_AUTHOR) {
        data.forEach((element) => {
            const info = { data: element.data(), id: element.id };
            info.data.authors.forEach((author: string) => {
                if (!dict.has(author)) {
                    dict.set(author, [info]);
                } else {
                    dict.set(author, [...(dict.get(author) as { data: DocumentData; id: string }[]), info]);
                }
            });
        });
    }
    return dict;
};

export const sortByNumbers = (a: number, b: number) => {
    return b - a;
};

export const sortByChars = (a: string, b: string) => {
    return a > b ? 1 : -1;
};

export const sortDocs = (a: DocumentData, b: DocumentData) => {
    return a.data.title > b.data.title ? 1 : -1;
};

export const generateSubtitle = (filter: TFilters, key: number | string) => {
    if (filter === FILTER_RATING) {
        const addition = key === 5 || key === 0 ? "звезд" : "звезды";
        return `${key} ${addition}`;
    } else if (filter === FILTER_YEAR) {
        if (key) {
            return `${key} год`;
        }
        return "Книги без указания года";
    } else if (filter === FILTER_AUTHOR) {
        return `${key}`;
    }
};

export const getRecommendation = (data: QueryDocumentSnapshot<DocumentData>[]) => {
    const currentYear = new Date().getFullYear();
    const ratingDict = new Map<number, { data: DocumentData; id: string }[]>();
    data.forEach((element) => {
        const info = { data: element.data(), id: element.id };
        if (info.data.publishedAt && currentYear - info.data.publishedAt >= 3) {
            if (!ratingDict.has(info.data.rating)) {
                ratingDict.set(info.data.rating, [info]);
            } else {
                ratingDict.set(info.data.rating, [...(ratingDict.get(info.data.rating) as { data: DocumentData; id: string }[]), info]);
            }
        }
    });
    const keys = [...(ratingDict.keys() as any)] as number[];
    if (keys.length > 0) {
        const maxRating = Math.max(...keys);
        return (ratingDict.get(maxRating) as { data: DocumentData; id: string }[])[
            Math.floor(Math.random() * (ratingDict.get(maxRating) as { data: DocumentData; id: string }[]).length)
        ];
    }
    return null;
};
