import * as React from "react";
import { checkAuth } from "../utils/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute( { children }: ProtectedRouteProps ) {
    const { isAuthenticated } = checkAuth();

    if ( !isAuthenticated ) {
        return <Navigate to="/signin" replace/>;
    }

    return children;

};
