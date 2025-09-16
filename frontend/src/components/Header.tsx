import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import type { HeaderProps } from "../validation/headerSchemas.ts";


const Header: React.FC<HeaderProps> = ({  portalName }) => {

    return (
        <Box sx={{ width: "100%" }}>
            {/* Top AppBar */}
            <AppBar
                position="static"
                sx={{
                    background: "primary.main",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        timekeeper
                    </Typography>
                    <Typography variant="body1" sx={{mr: 1}}>{portalName}</Typography>
                </Toolbar>
            </AppBar>

            {/* Bottom Navbar */}
            <Navbar />
        </Box>
    );
};

export default Header;
