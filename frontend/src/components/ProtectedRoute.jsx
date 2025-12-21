import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ProtectedRoute({ children }) {
  const { isAuthenticated, verifyToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Verify token on mount
    if (isAuthenticated) {
      verifyToken();
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;


