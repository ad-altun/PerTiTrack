import React from "react";
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
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

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

    const handleSettingsClick = () => {
        handleMenuClose();
        navigate('/account-settings');
    };

    const isActiveRoute = ( route: string ) => {
        return location.pathname === route || activePage?.toLowerCase() === route.replace('/', '');
    };

    const navigateTo = ( route: string ) => {
        navigate(route);
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={ {
                bgcolor: "background.navBar",
                px: 2,
                py: 1,
            } }
        >
            {/* Left side - navigation */ }
            <Box>
                <Button
                    onClick={ () => navigateTo('/dashboard') }
                    sx={ {
                        mr: 1,
                        backgroundColor:
                            isActiveRoute('/dashboard') ||
                            isActiveRoute('/') ?
                                "navItem.active" : "navItem.default",
                        color: "text.header",
                        "&:hover": { backgroundColor: "navItem.hover", fontWeight: "bold", },
                        textTransform: 'none',
                    } }
                >
                    HomePage
                </Button>
                <Button
                    onClick={ () => navigateTo('/timesheet') }
                    sx={ {
                        backgroundColor:
                            isActiveRoute('/timesheet') ? "navItem.active" : "navItem.default",
                        color: "text.header",
                        "&:hover": { backgroundColor: "navItem.hover" },
                        textTransform: 'none',
                    } }
                >
                    Timesheet
                </Button>
            </Box>

            {/* Right side - avatar */ }
            <Box display="flex" alignItems="center">
                <IconButton onClick={ handleMenuOpen }
                            sx={ {
                                textTransform: 'none', borderRadius: '9px', paddingInline: '20px',
                                "&:hover": { backgroundColor: "navItem.hover", color: "text.header" },
                            } }>
                    <Avatar sx={ { width: 28, height: 28, mr: 1, color: "text.header", } }>
                        { userName.charAt(0) }
                    </Avatar>
                    <Typography variant="body2"
                                sx={ { color: "text.header", mr: 0.5 } }>
                        { userName }
                    </Typography>
                    <ArrowDropDownIcon sx={ { color: "text.header" } }/>
                </IconButton>

                <Menu
                    anchorEl={ anchorEl }
                    open={ Boolean(anchorEl) }
                    onClose={ handleMenuClose }
                >
                    <MenuItem onClick={ handleSettingsClick }
                    >Account settings</MenuItem>
                    {/*<MenuItem onClick={ handleMenuClose }>Change account</MenuItem>*/ }
                    <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};
export default Navbar;
