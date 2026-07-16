import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../src/components/Login";
import App from "../src/App";

function AuthGuard({ children }) {
  const isLoggedIn = localStorage.getItem("wistrack_token") !== null;
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <App />
      </AuthGuard>
    ),
  },
]);
