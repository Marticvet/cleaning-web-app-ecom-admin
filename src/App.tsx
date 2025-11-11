import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import LoginPage from "./components/LoginPage/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicOnly } from "./auth/PublicOnly";

// src/components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const onClick = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return <button onClick={onClick}>Sign out</button>;
}


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
        { path: "/dashboard", element: <LogoutButton /> },
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
