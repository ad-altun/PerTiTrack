import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useLogout } from "../hooks/useLogout.ts";
import { useAppSelector } from "../store/hook.ts";
import {
    selectActivePage,
    selectUserProfileName
} from "../store/selectors/navbarSelectors.ts";

const Navbar = () => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);

    const activePage = useAppSelector(selectActivePage);
    const userName = useAppSelector(selectUserProfileName);

    const handleMenuOpen = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const { logout, isLoading } = useLogout();

    const handleLogout = async () => {
        if ( !isLoading ) {
            await logout();
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={ {
                backgroundColor: "#373748", // dark gray background for navbar
                px: 2,
                py: 1,
            } }
        >
            {/* Left side - navigation */ }
            <Box>
                <Button
                    sx={ {
                        mr: 1,
                        backgroundColor: activePage === "HomePage" ? "#c53e3e" : "transparent",
                        color: activePage === 'HomePage' ? "white" : "white",
                        "&:hover": { backgroundColor: "#4a5568", color: "white" },
                    } }
                >
                    HomePage
                </Button>
                <Button
                    sx={ {
                        backgroundColor: activePage === 'Timesheet' ? "#e53e3e" : "transparent",
                        color: "white",
                        "&:hover": { backgroundColor: "#e53e3e", color: "white" },
                    } }
                >
                    Timesheet
                </Button>
            </Box>

            {/* Right side - avatar */ }
            <Box display="flex" alignItems="center">
                <IconButton onClick={ handleMenuOpen } color="inherit">
                    <Avatar sx={ { width: 28, height: 28, mr: 1 } }>
                        { userName.charAt(0) }
                    </Avatar>
                    <Typography variant="body2" sx={ { color: "white", mr: 0.5 } }>
                        { userName }
                    </Typography>
                    <ArrowDropDownIcon sx={ { color: "white" } }/>
                </IconButton>

                <Menu
                    anchorEl={ anchorEl }
                    open={ Boolean(anchorEl) }
                    onClose={ handleMenuClose }
                >
                    <MenuItem onClick={ handleMenuClose }>Account settings</MenuItem>
                    <MenuItem onClick={ handleMenuClose }>Change account</MenuItem>
                    <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};
export default Navbar;
