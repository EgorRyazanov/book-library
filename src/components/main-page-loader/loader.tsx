import { Skeleton, Box } from "@mui/material";
import { FC } from "react";

export const Loader: FC = () => {
    return (
        <Box alignItems="center" sx={{ width: "100%", height: "100vh" }}>
            <Skeleton variant="rectangular" width={"100%"} height={30} sx={{ mb: 2, mt: 2 }}></Skeleton>
            {[0, 1, 2, 3, 4].map((element, index) => (
                <Skeleton key={index} variant="rectangular" width={"100%"} height={118} sx={{ mb: 2 }}></Skeleton>
            ))}
        </Box>
    );
};
