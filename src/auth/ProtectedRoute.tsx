// src/auth/ProtectedRoute.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "../components/Navbar/Navbar";

export function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const navigation = useNavigate();
    if (loading) return null;

    if (!isAuthed) {
        navigation("/login");
        return;
        // return <Navigate to="/login" replace state={{ from: loc }} />;
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
