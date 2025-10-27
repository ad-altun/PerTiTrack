import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { LightMode, DarkMode, Computer } from "@mui/icons-material";
import { useLogout } from "../hooks/useLogout.ts";
import { useAppSelector } from "../store/hook.ts";
import {
    selectActivePage,
    selectUserProfileName
} from "../store/selectors/navbarSelectors.ts";
import { Button, Container, Divider, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/UseTheme.tsx";


const Navbar = () => {
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [ mobileMenuAnchor, setMobileMenuAnchor ] = React.useState<null | HTMLElement>(null);
    // const [ unauthMobileMenuAnchor, setUnauthMobileMenuAnchor ] = React.useState<null | HTMLElement>(null);

    const activePage = useAppSelector(selectActivePage);
    const userName = useAppSelector(selectUserProfileName);
    const { mode, toggleMode, actualMode } = useTheme();

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

    const isOnLandingPage: boolean = location.pathname === '/';

    const navigateTo = ( route: string ) => {
        navigate(route);
    };

    const handleMobileMenuOpen = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        setMobileMenuAnchor(event.currentTarget);
    };
    const handleMobileMenuClose = () => setMobileMenuAnchor(null);

    // const handleUnauthMobileMenuOpen = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    //     setUnauthMobileMenuAnchor(event.currentTarget);
    // };
    // const handleUnauthMobileMenuClose = () => setUnauthMobileMenuAnchor(null);

    // Get theme icon and tooltip text
    const getThemeIcon = () => {
        switch ( mode ) {
            case 'light':
                return <LightMode/>;
            case 'dark':
                return <DarkMode/>;
            case 'system':
                return <Computer/>;
            default:
                return <Computer/>;
        }
    };

    const getThemeTooltip = () => {
        switch ( mode ) {
            case 'light':
                return 'Light Mode (Click for Dark)';
            case 'dark':
                return 'Dark Mode (Click for System)';
            case 'system':
                return `System Mode (Currently ${ actualMode })`;
            default:
                return 'Toggle Theme';
        }
    };

    const getThemeLabel = () => {
        switch ( mode ) {
            case 'light':
                return 'Light Mode';
            case 'dark':
                return 'Dark Mode';
            case 'system':
                return 'System Mode';
            default:
                return 'Theme';
        }
    };

    return (
        isAuthed ? (
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={ {
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    // background: "linear-gradient(-90deg, #6E0CFB, #3C467B)",
                    background: ( theme ) => theme.palette.navbar.background,
                    boxShadow: ( theme ) => theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(0,0,0,0.3)'
                        : '0 1px 3px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid',
                    borderColor: 'navbar.border',
                } }
            >
                {/* Left side - navigation */ }
                {/* Desktop Navigation */ }
                <Box
                    sx={ {
                        display: { xs: 'none', md: 'flex' },
                        gap: 1,
                        alignItems: 'center',
                    } }
                >
                    {/*<Link to="/" style={ { textDecoration: "none" } }>*/ }
                    {/*    <Typography variant="h6"*/ }
                    {/*                sx={ {*/ }
                    {/*                    fontWeight: "bold",*/ }
                    {/*                    color: "text.header"*/ }
                    {/*                } }>*/ }
                    {/*        PerTiTrack*/ }
                    {/*    </Typography>*/ }
                    {/*</Link>*/ }
                    <Button
                        onClick={ () => navigateTo('/dashboard') }
                        sx={ {
                            backgroundColor:
                                isActiveRoute('/dashboard') ||
                                isActiveRoute('/') ?
                                    "navItem.active" : "navItem.default",
                            color: "navbar.text",
                            "&:hover": {
                                backgroundColor: "navItem.hover",
                            },
                            textTransform: 'none',
                            fontWeight: isActiveRoute('/dashboard') || isActiveRoute('/') ? 600 : 500,
                        } }
                    >
                        Home
                    </Button>
                    <Button
                        onClick={ () => navigateTo('/timesheet') }
                        sx={ {
                            backgroundColor:
                                isActiveRoute('/timesheet') ? "navItem.active" : "navItem.default",
                            color: "navbar.text",
                            "&:hover": { backgroundColor: "navItem.hover" },
                            textTransform: 'none',
                            fontWeight: isActiveRoute('/timesheet') ? 600 : 500,
                        } }
                    >
                        Timesheet
                    </Button>
                    <Button
                        onClick={ () => navigateTo('/absence-calendar') }
                        sx={ {
                            backgroundColor:
                                isActiveRoute('/absence-calendar') ? "navItem.active" : "navItem.default",
                            color: "navbar.text",
                            "&:hover": { backgroundColor: "navItem.hover" },
                            textTransform: 'none',
                            fontWeight: isActiveRoute('/absence-calendar') ? 600 : 500,
                        } }
                    >
                        Absence Calendar
                    </Button>
                </Box>

                {/* Mobile Menu Button */ }
                <IconButton
                    onClick={ handleMobileMenuOpen }
                    sx={ {
                        display: { xs: 'flex', md: 'none' },
                        color: "navbar.text",
                    } }
                >
                    <MenuIcon/>
                </IconButton>

                {/* Mobile Navigation Menu */ }
                <Menu
                    anchorEl={ mobileMenuAnchor }
                    open={ Boolean(mobileMenuAnchor) }
                    onClose={ handleMobileMenuClose }
                    sx={ { display: { xs: 'block', md: 'none' } } }
                >
                    <MenuItem
                        onClick={ () => {
                            navigateTo('/dashboard');
                            handleMobileMenuClose();
                        } }
                        selected={ isActiveRoute('/dashboard') || isActiveRoute('/') }
                    >
                        Home
                    </MenuItem>
                    <MenuItem
                        onClick={ () => {
                            navigateTo('/timesheet');
                            handleMobileMenuClose();
                        } }
                        selected={ isActiveRoute('/timesheet') }
                    >
                        Timesheet
                    </MenuItem>
                    <MenuItem
                        onClick={ () => {
                            navigateTo('/absence-calendar');
                            handleMobileMenuClose();
                        } }
                        selected={ isActiveRoute('/absence-calendar') }
                    >
                        Absence Calendar
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={ toggleMode }>
                        <ListItemIcon>
                            { getThemeIcon() }
                        </ListItemIcon>
                        <ListItemText>{ getThemeLabel() }</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Right side - avatar */ }
                <Box display="flex" alignItems="center" gap={ 1 }>
                    {/* Theme Toggle Button */ }
                    <Tooltip title={ getThemeTooltip() } arrow>
                        <IconButton
                            onClick={ toggleMode }
                            sx={ {
                                display: { xs: 'none', md: 'flex' },
                                color: "navbar.text",
                                "&:hover": {
                                    backgroundColor: "navbar.hover",
                                },
                            } }
                        >
                            { getThemeIcon() }
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        onClick={ handleMenuOpen }
                        sx={ {
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: { xs: 1, sm: 2 },
                            "&:hover": {
                                backgroundColor: "navbar.hover",
                            },
                        } }
                    >
                        <Avatar sx={ {
                            width: 32,
                            height: 32,
                            mr: { xs: 0.5, sm: 1 },
                            bgcolor: 'navItem.active',
                            color: "navbar.text",
                        } }>
                            { userName.charAt(0).toUpperCase() }
                        </Avatar>
                        <Typography
                            variant="body2"
                            sx={ {
                                color: "navbar.text",
                                mr: 0.5,
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 500,
                            } }
                        >
                            { userName }
                        </Typography>
                        <ArrowDropDownIcon sx={ { color: "navbar.text" } }/>
                    </IconButton>

                    <Menu
                        anchorEl={ anchorEl }
                        open={ Boolean(anchorEl) }
                        onClose={ handleMenuClose }
                    >
                        <MenuItem onClick={ handleSettingsClick }>Account settings</MenuItem>
                        <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                    </Menu>
                </Box>
            </Box>
        ) : (
            // user is on the landing page
            isOnLandingPage ? (
                <Box
                    sx={ {
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        background: ( theme ) => theme.palette.navbar.background,
                        boxShadow: ( theme ) => theme.palette.mode === 'dark'
                            ? '0 2px 8px rgba(0,0,0,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.1)',
                        borderBottom: '1px solid',
                        borderColor: 'navbar.border',
                    } }
                >
                    <Container maxWidth="xl">
                        <Box
                            sx={ {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                py: 1.5,
                            } }
                        >
                            {/* Left side - Logo/Brand */ }
                            <Box>
                                <Button
                                    onClick={ () => document.getElementById('hero-section')?.scrollIntoView({
                                        behavior: 'smooth'
                                    }) }
                                    sx={ {
                                        color: "navbar.text",
                                        "&:hover": {
                                            backgroundColor: "navbar.hover",
                                        },
                                        textTransform: 'none',
                                        px: 2,
                                    } }
                                >
                                    <Typography
                                        sx={ {
                                            typography: { xs: 'h6', sm: 'h5' },
                                            fontWeight: 'bold',
                                        } }
                                    >
                                        PerTiTrack
                                    </Typography>
                                </Button>
                            </Box>

                            {/* Desktop Navigation */ }
                            <Box
                                sx={ {
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: "center",
                                    gap: 1,
                                } }
                            >
                                <Button
                                    onClick={ () => document.getElementById('features-section')?.scrollIntoView({
                                        behavior: 'smooth'
                                    }) }
                                    sx={ {
                                        color: "navbar.text",
                                        "&:hover": {
                                            backgroundColor: "navbar.hover",
                                        },
                                        textTransform: 'none',
                                        fontWeight: 500,
                                    } }
                                >
                                    Features
                                </Button>
                                <Button
                                    onClick={ () => document.getElementById('about-section')?.scrollIntoView({
                                        behavior: 'smooth'
                                    }) }
                                    sx={ {
                                        color: "navbar.text",
                                        "&:hover": {
                                            backgroundColor: "navbar.hover",
                                        },
                                        textTransform: 'none',
                                        fontWeight: 500,
                                    } }
                                >
                                    About
                                </Button>
                                <Button
                                    onClick={ () => navigateTo('/auth/signin') }
                                    sx={ {
                                        color: "navbar.text",
                                        "&:hover": {
                                            backgroundColor: "navbar.hover",
                                        },
                                        textTransform: 'none',
                                        fontWeight: 500,
                                    } }
                                >
                                    Login
                                </Button>
                                {/* Theme Toggle Button */ }
                                <Tooltip title={ getThemeTooltip() } arrow>
                                    <IconButton
                                        onClick={ toggleMode }
                                        sx={ {
                                            color: "navbar.text",
                                            "&:hover": {
                                                backgroundColor: "navbar.hover",
                                            },
                                        } }
                                    >
                                        { getThemeIcon() }
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* Mobile Menu Button */}
                            <IconButton
                                onClick={ handleMobileMenuOpen }
                                sx={ {
                                    display: { xs: 'flex', md: 'none' },
                                    color: "navbar.text",
                                } }
                            >
                                <MenuIcon/>
                            </IconButton>

                            {/* Mobile Navigation Menu */ }
                            <Menu
                                anchorEl={ mobileMenuAnchor }
                                open={ Boolean(mobileMenuAnchor) }
                                onClose={ handleMobileMenuClose }
                                sx={ { display: { xs: 'block', md: 'none' } } }
                            >
                                <MenuItem
                                    onClick={ () => {
                                        document.getElementById('features-section')?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                        handleMobileMenuClose();
                                    } }
                                >
                                    Features
                                </MenuItem>
                                <MenuItem
                                    onClick={ () => {
                                        document.getElementById('about-section')?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                        handleMobileMenuClose();
                                    } }
                                >
                                    About
                                </MenuItem>
                                <MenuItem
                                    onClick={ () => {
                                        navigateTo('/auth/signin');
                                        handleMobileMenuClose();
                                    } }
                                >
                                    Login
                                </MenuItem>
                                <Divider/>
                                <MenuItem onClick={ toggleMode }>
                                    <ListItemIcon>
                                        { getThemeIcon() }
                                    </ListItemIcon>
                                    <ListItemText>{ getThemeLabel() }</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Container>
                </Box>

            ) : (
                // user is on login, signup page
                <Box
                    sx={ {
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        background: ( theme ) => theme.palette.navbar.background,
                        boxShadow: ( theme ) => theme.palette.mode === 'dark'
                            ? '0 2px 8px rgba(0,0,0,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.1)',
                        borderBottom: '1px solid',
                        borderColor: 'navbar.border',
                    } }
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={ {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                py: 1.5,
                            } }
                        >
                            {/* Left - Logo */ }
                            <Button
                                onClick={ () => navigateTo('/') }
                                sx={ {
                                    color: "navbar.text",
                                    "&:hover": {
                                        backgroundColor: "navbar.hover",
                                    },
                                    textTransform: 'none',
                                    px: 2,
                                } }
                            >
                                <Typography
                                    sx={ {
                                        typography: { xs: 'h6', sm: 'h5' },
                                        fontWeight: 'bold',
                                    } }
                                >
                                    PerTiTrack
                                </Typography>
                            </Button>

                            {/* Right - Auth Links */ }
                            <Box sx={ { display: 'flex', gap: 1, alignItems: 'center' } }>
                                {/* Desktop Theme Toggle */ }
                                <Tooltip title={ getThemeTooltip() } arrow>
                                    <IconButton
                                        onClick={ toggleMode }
                                        sx={ {
                                            display: { xs: 'none', sm: 'flex' },
                                            color: "navbar.text",
                                            "&:hover": {
                                                backgroundColor: "navbar.hover",
                                            },
                                        } }
                                    >
                                        { getThemeIcon() }
                                    </IconButton>
                                </Tooltip>

                                { location.pathname === '/auth/signin' ? (
                                    <Button
                                        onClick={ () => navigateTo('/auth/register') }
                                        variant="outlined"
                                        sx={ {
                                            color: "navbar.text",
                                            borderColor: 'navbar.border',
                                            "&:hover": {
                                                backgroundColor: "navbar.hover",
                                                borderColor: 'navbar.text',
                                            },
                                            textTransform: 'none',
                                        } }
                                    >
                                        Sign Up
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={ () => navigateTo('/auth/signin') }
                                        variant="outlined"
                                        sx={ {
                                            color: "navbar.text",
                                            borderColor: 'navbar.border',
                                            "&:hover": {
                                                backgroundColor: "navbar.hover",
                                                borderColor: 'navbar.text',
                                            },
                                            textTransform: 'none',
                                        } }
                                    >
                                        Sign In
                                    </Button>
                                ) }

                                {/* Mobile Menu Button with Theme Toggle */ }
                                <IconButton
                                    onClick={ handleMobileMenuOpen }
                                    sx={ {
                                        display: { xs: 'flex', sm: 'none' },
                                        color: "navbar.text",
                                    } }
                                >
                                    <MenuIcon/>
                                </IconButton>

                                {/* Mobile Menu */ }
                                <Menu
                                    anchorEl={ mobileMenuAnchor }
                                    open={ Boolean(mobileMenuAnchor) }
                                    onClose={ handleMobileMenuClose }
                                    sx={ { display: { xs: 'block', sm: 'none' } } }
                                >
                                    <MenuItem onClick={ toggleMode }>
                                        <ListItemIcon>
                                            { getThemeIcon() }
                                        </ListItemIcon>
                                        <ListItemText>{ getThemeLabel() }</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            )
        )
    );
};
export default Navbar;
