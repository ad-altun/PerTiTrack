import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";
import Footer from "../components/Footer.tsx";
import { Paper } from "@mui/material";
import Navbar from "../components/Navbar.tsx";


export default function AuthLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( isAuthenticated ) {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <Paper elevation={ 0 }
               sx={ {
                   display: 'flex', flexDirection: 'column',
                   alignItems: 'stretch', justifyContent: 'space-between', minHeight: '100vh'
               } }>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </Paper>
    );
};
