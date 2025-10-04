import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { HeaderProps } from "../validation/headerSchemas.ts";
import { Link } from "react-router-dom";

const Header: React.FC<HeaderProps> = ( { portalName } ) => {

    return (
        <Box sx={ { width: "100%" } }>
            {/* Top AppBar */ }
            <AppBar
                position="static"
                sx={ {
                    bgcolor: "background.appBar",
                    borderRadius: "0"
                } }
            >
                <Toolbar sx={ { justifyContent: "space-between" } }>
                    <Link to="/" style={ { textDecoration: "none" } }>
                        <Typography variant="h6"
                                    sx={ {
                                        fontWeight: "bold",
                                        color: "text.header" } }>
                            timekeeper
                        </Typography>
                    </Link>
                    <Box display="flex" alignItems="center" gap={ 1 }>
                        <Typography variant="h6"
                                    sx={ {
                                        mr: 1,
                                        color: "text.header",
                                        fontWeight: "bold"} }
                        >{ portalName }</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
