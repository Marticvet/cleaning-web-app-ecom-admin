// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "../components/Navbar/Navbar";
import { useEffect } from "react";

export function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

    console.log(
        localStorage.getItem("sb-qakickkytstfcbzpyxvw-auth-token"),
        `localStorage.getItem("sb-qakickkytstfcbzpyxvw-auth-token")`
    );

    useEffect(() => {
        if (!localStorage.getItem("sb-qakickkytstfcbzpyxvw-auth-token")) {
            <Navigate to="/login" replace state={{ from: loc }} />;
        }
    }, [loc]);

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
