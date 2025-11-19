// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "../components/Navbar/Navbar";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

    if (loading){
        return <LoadingSpinner />
    };

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
