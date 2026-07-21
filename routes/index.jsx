import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../src/components/Login";
import App from "../src/App";

// Guard: kalau belum login, redirect ke login
function AuthGuard({ children }) {
  const token = localStorage.getItem("wistrack_token");
  const isLoggedIn = localStorage.getItem("wistrack_is_logged_in") === "true";
  if (!token || !isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

// Guest guard: kalau sudah login, redirect ke dashboard (biar ga bisa buka /login lagi)
function GuestGuard({ children }) {
  const token = localStorage.getItem("wistrack_token");
  const isLoggedIn = localStorage.getItem("wistrack_is_logged_in") === "true";
  if (token && isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <App />
      </AuthGuard>
    ),
  },
  {
    // Tangkap semua route yang tidak ada
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
