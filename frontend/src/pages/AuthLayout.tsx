import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";


export default function AuthLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( isAuthenticated ) {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <div>
            <Outlet/>
        </div>
    );
};
