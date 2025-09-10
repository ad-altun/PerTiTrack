import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";
import Header from "../components/Header.tsx";

export default function RootLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( !isAuthenticated ) {
        return <Navigate to="/auth/signin" replace/>;
    }

    return (
        <div>
            <Header userName="Jane Patrick"
                    portalName="Employee Portal"
                    activePage="Timesheet" />
            <Outlet/>
        </div>
    );
};
