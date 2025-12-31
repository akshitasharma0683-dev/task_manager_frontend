import { Navigate } from "react-router-dom";

/**
 * Blocks access to protected pages
 * If no JWT token → redirect to login
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
