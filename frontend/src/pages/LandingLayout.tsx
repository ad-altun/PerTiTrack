import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";
import Footer from "../components/Footer.tsx";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar.tsx";


export default function LandingLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( isAuthenticated ) {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <Box
            sx={ {
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            } }>
            <Navbar/>
            <Box
                component="main"
                sx={ {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                } }
            >
                <Outlet/>
            </Box>
            <Footer/>
        </Box>
    );
};
