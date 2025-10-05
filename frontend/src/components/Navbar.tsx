import React, { useMemo } from "react";
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
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const activePage = useAppSelector(selectActivePage);
    const userName = useAppSelector(selectUserProfileName);

    const { isAuthenticated, token } = useAppSelector(( state ) => state.auth);
    const location = useLocation();

    const isAuthed = useMemo(() => {
        if ( !isAuthenticated || !token ) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[ 1 ]));
            return payload.exp > Date.now() / 1000;
        }
        catch {
            return false;
        }
    }, [ isAuthenticated, token ]);

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
        isAuthed ? (
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
                        Home
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
        ) : (
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={ {
                    // bgcolor: "background.navBar",
                    background: "linear-gradient(0deg, #6E8CFB, #3C467B)",
                    px: 2,
                    py: 1,
                } }
            >
                {/* Left side - navigation */ }
                <Box>
                    <Button
                        onClick={ () => navigateTo('/') }
                        sx={ {
                            m: 1,
                            // backgroundColor: "navItem.active",
                            color: "text.header",
                            "&:hover": { backgroundColor: "#6E8CFB", fontWeight: "bold", },
                            textTransform: 'none',
                        } }
                    >
                        <Typography variant="h5">
                            PerTiTrack
                        </Typography>
                    </Button>
                </Box>

                {/* Right side  */ }
                <Box
                    sx={ {
                        display: "flex",
                        alignItems: "center",
                        gap: '1rem',
                        paddingBlock: '1rem',
                    } }
                >

                    <Button
                        onClick={ () => document.getElementById('about-section')?.scrollIntoView({
                            behavior: 'smooth'
                        }) }
                        sx={ {
                            mr: 1,
                            // backgroundColor:
                            //     isActiveRoute('/dashboard') ||
                            //     isActiveRoute('/') ?
                            //         "navItem.active" : "navItem.default",
                            color: "text.header",
                            "&:hover": { backgroundColor: "#6E8CFB", fontWeight: "bold", },
                            textTransform: 'none',
                        } }
                    >
                        <Typography variant="h5">
                            About
                        </Typography>

                    </Button>
                    <Button
                        onClick={ () => navigateTo('/auth/signin') }
                        sx={ {
                            mr: 1,
                            // backgroundColor:
                            //     isActiveRoute('/dashboard') ||
                            //     isActiveRoute('/') ?
                            //         "navItem.active" : "navItem.default",
                            color: "text.header",
                            "&:hover": { backgroundColor: "#6E8CFB", fontWeight: "bold", },
                            textTransform: 'none',
                        } }
                    >
                        <Typography variant="h5">
                            Login
                        </Typography>

                    </Button>
                </Box>
            </Box>
        )
    );
};
export default Navbar;
