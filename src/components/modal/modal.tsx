import { memo, useEffect, FC, ReactNode } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalContainer = document.getElementById("modal-container") as HTMLElement;
const body = document.body;

interface IModal {
    children: ReactNode;
    handleToggleModal: () => void;
}

export const Modal: FC<IModal> = memo(({ children, handleToggleModal }) => {
    const handleEscPressed = (event: KeyboardEvent) => (event.code === "Escape" ? handleToggleModal() : null);
    useEffect(() => {
        body.style.overflow = "hidden";
        modalContainer.classList.add("modal-container--active");
        document.addEventListener("keydown", handleEscPressed);
        return () => {
            modalContainer.classList.remove("modal-container--active");
            body.style.overflow = "auto";
            document.removeEventListener("keydown", handleEscPressed);
        };
    }, []);

    return ReactDOM.createPortal(
        <Box
            className={`${styles.modal}`}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    handleToggleModal();
                }
            }}
        >
            <Box onClick={() => handleToggleModal()} className={styles.overlay}></Box>
            <Box sx={{ backgroundColor: "white", borderRadius: 8, width: 350, minHeight: 200 }}>
                <Box sx={{ display: "flex" }}>
                    <IconButton sx={{ alignItems: "flex-start", ml: "auto" }} onClick={handleToggleModal} size="large" edge="start">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography sx={{ verticalAlign: "middle", textAlign: "center", mt: -2 }} variant="h6" component="p">
                    Книга
                </Typography>

                {children}
            </Box>
        </Box>,
        modalContainer
    );
});
