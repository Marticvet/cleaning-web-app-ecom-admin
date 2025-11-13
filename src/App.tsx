import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./auth/AuthProvider";
import LoginPage from "./components/LoginPage/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicOnly } from "./auth/PublicOnly";
import Dashboard from "./components/Dashboard/Dashboard";

// src/components/LogoutButton.tsx


// --- your pages ---
// function Dashboard() { return <div>Dashboard (protected)</div>; }
function NotFound() { return <div>Not found!!!!</div>; }

const router = createBrowserRouter([
    // PUBLIC routes only: "/" and "/login"
    {
      element: <PublicOnly />,
      children: [
        { path: "/", element: <LoginPage /> },
        { path: "/login", element: <LoginPage /> },
      ],
    },
  
    // PROTECTED routes (must be logged in)
    {
      element: <ProtectedRoute />,
      children: [
        { path: "/dashboard", element: <Dashboard />},
      ],
    },
  
    // Fallback
    { path: "*", element: <NotFound /> },
  ]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
