// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // tu context de auth

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // ⬅️ si user es null = no logueado

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
