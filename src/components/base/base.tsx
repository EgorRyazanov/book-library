import { FC } from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../sidebar/sidebar";
import { Container } from "@mui/material";

export const Base: FC = () => {
    return (
        <>
            <Container maxWidth="xl" sx={{ display: "flex" }}>
                <SideBar />
                <Outlet />
            </Container>
        </>
    );
};
