import { Navigate, Outlet } from "react-router-dom";


export default function AuthLayout() {

    const isAuthenticated = false;

    if ( isAuthenticated ) {
        return <Navigate to="/home" replace/>;
    }

    return (
        <div>
            <Outlet/>
        </div>
    );
};
