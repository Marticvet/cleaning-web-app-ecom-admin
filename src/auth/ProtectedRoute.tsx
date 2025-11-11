// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();
    if (loading) return null;
    if (!isAuthed)
        return <Navigate to="/login" replace state={{ from: loc }} />;
    return <Outlet />;
}