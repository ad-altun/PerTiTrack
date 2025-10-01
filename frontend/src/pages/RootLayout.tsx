import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook.ts";
import Header from "../components/Header.tsx";
import { useMemo } from "react";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";

export default function RootLayout() {

    const { isAuthenticated, token } = useAppSelector((state) => state.auth);

    const isAuthed = useMemo(() => {
        if (!isAuthenticated || !token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }, [isAuthenticated, token]);

    if (!isAuthed) {
        return <Navigate to="/auth/signin" replace />;
    }

    return (
        <div>
            <Header portalName="Employee Portal" />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};
