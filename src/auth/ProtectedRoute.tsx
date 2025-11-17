// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "../components/Navbar/Navbar";

export function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

    if (loading) return null;

    if (!isAuthed) {
        return <Navigate to="/login" replace state={{ from: loc }} />;
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
