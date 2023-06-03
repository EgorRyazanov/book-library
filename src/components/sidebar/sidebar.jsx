import { Drawer, Box, IconButton, Divider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { useState, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { Context } from "../app/app";

const SideBar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { filter, setFilter } = useContext(Context);
    const navigate = useNavigate();

    return (
        <>
            <IconButton
                sx={{ alignItems: "flex-start", height: 50 }}
                onClick={() => setIsDrawerOpen(true)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="logo"
            >
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box p={2} width="250px" role="presentation" textAlign="center" sx={{ mb: 2 }}>
                    <FormControl sx={{ width: "100%" }} component="fieldset">
                        <Divider />
                        <FormLabel sx={{ mb: 1 }} component="legend">
                            Фильтры
                        </FormLabel>
                        <RadioGroup aria-label="filter" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <FormControlLabel value="rating" control={<Radio />} label="По рейтингу" />
                            <FormControlLabel value="author" control={<Radio />} label="По автору" />
                            <FormControlLabel value="year" control={<Radio />} label="По годам" />
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                </Box>
                <Button onClick={() => navigate("add")} style={{ margin: "0 auto", display: "flex" }} sx={{ width: "80%" }} variant="outlined">
                    Добавить книгу
                </Button>
            </Drawer>
        </>
    );
};

export default SideBar;
