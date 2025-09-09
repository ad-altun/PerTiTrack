import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";


export default function RootLayout() {

    const isAuthenticated = false;

    if ( !isAuthenticated ) {
        return <Navigate to="/signin" replace/>;
    }

    return (
        <div>
            <ProtectedRoute>
                <Outlet/>
            </ProtectedRoute>
        </div>
    );
};
