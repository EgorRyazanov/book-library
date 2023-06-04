import { Typography, Skeleton } from "@mui/material";
import { FC } from "react";

interface IFormLoader {
    styles: string;
}

export const FormLoader: FC<IFormLoader> = ({ styles }) => {
    return (
        <div className={styles}>
            <Typography variant="h4" component="div">
                Отредактируйте книгу
            </Typography>
            <Skeleton sx={{ mt: 4, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
            <Skeleton sx={{ mt: 2, width: "100%", height: 30 }} />
        </div>
    );
};
