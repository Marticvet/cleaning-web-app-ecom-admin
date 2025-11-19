// src/auth/PublicOnly.tsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export function PublicOnly() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

  if (loading){
        return <LoadingSpinner />
    };

    // If user already logged in → redirect to dashboard
    if (isAuthed) {
        return <Navigate to="/dashboard" replace state={{ from: loc }} />;
    }

    // Otherwise render the public routes (login, register)
    return <Outlet />;
}
