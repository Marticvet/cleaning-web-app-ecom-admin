// src/auth/PublicOnly.tsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PublicOnly() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

    if (loading) return null; // or spinner

    // If user already logged in → redirect to dashboard
    if (isAuthed) {
        return <Navigate to="/dashboard" replace state={{ from: loc }} />;
    }

    // Otherwise render the public routes (login, register)
    return <Outlet />;
}
