import { Box, Typography, Divider, Rating } from "@mui/material";
import { TData } from "../../utils/types";
import { FC } from "react";

interface IBooKViewModal {
    data: TData;
}

const BookViewModal: FC<IBooKViewModal> = ({ data }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ justifyContent: "flex-start", wordWrap: "break-word" }} variant="body1" component="p">
                {`Название: ${data.title}`}
            </Typography>
            <Divider />
            {}
            <Typography sx={{ justifyContent: "flex-start" }} variant="body1" component="p">
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
        </Box>
    );
};
export default BookViewModal;
