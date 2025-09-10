import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";


export default function RootLayout() {

    const isAuthenticated = useIsAuthenticated();

    if ( !isAuthenticated ) {
        return <Navigate to="/auth/signin" replace/>;
    }

    return (
        <div>
            <Outlet/>
        </div>
    );
};
