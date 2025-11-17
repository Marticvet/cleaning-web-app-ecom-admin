import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export function PublicOnly() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();
    
    useEffect(() => {
        if (!localStorage.getItem("sb-qakickkytstfcbzpyxvw-auth-token")) {
            <Navigate to="/login" replace state={{ from: loc }} />;
        }
    }, [loc]);

    if (loading) return null; // or a spinner

    return isAuthed ? <Navigate to="/dashboard" /> : <Outlet />;
}
