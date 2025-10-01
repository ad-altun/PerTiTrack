import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Box, Paper } from "@mui/material";


export default function AuthLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( isAuthenticated ) {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <Paper elevation={0}
               sx={{ display: 'flex', flexDirection: 'column',
                   alignItems:'stretch', justifyContent: 'space-between', minHeight: '100vh' }} >
            <Header portalName="Employee Portal" />
            <Outlet/>
            <Box>
                <Footer />
            </Box>
        </Paper>
    );
};
