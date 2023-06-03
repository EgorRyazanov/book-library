import { FC } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import { Container } from "@mui/material";

const Base: FC = () => {
    return (
        <>
            <Container maxWidth="xl" sx={{ display: "flex" }}>
                <Sidebar />
                <Outlet />
            </Container>
        </>
    );
};

export default Base;
