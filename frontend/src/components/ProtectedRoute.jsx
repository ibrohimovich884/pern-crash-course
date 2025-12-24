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



export const AdminRoute = ({ children }) => {
	const { isAuthenticated, user, loading } = useAuthStore();
	const location = useLocation();

	if (loading) return <div className="flex justify-center h-screen items-center"><span className="loading loading-lg"></span></div>;

	if (!isAuthenticated) {
		// Login qilmagan bo'lsa login sahifasiga
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!user?.isAdmin) {
		// Login qilgan lekin admin bo'lmasa, Homega qaytarib yuboramiz
		return <Navigate to="/" replace />;
	}

	return children;
};

