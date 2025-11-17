import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function PublicOnly() {
    const { loading, isAuthed } = useAuth();
    if (loading) return null; // or a spinner
    return isAuthed ? <Navigate to="/dashboard" /> : <Outlet />;
}
