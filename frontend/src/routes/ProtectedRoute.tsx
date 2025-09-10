import * as React from "react";
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../store/hook.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute( { children }: ProtectedRouteProps ) {
    const isAuthenticated = useIsAuthenticated();

    if ( !isAuthenticated ) {
        return <Navigate to="/auth/signin" replace/>;
    }

    return <>{ children }</>;

};
