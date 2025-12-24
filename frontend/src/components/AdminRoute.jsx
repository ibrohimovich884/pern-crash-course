// src/components/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuthStore();
    const location = useLocation();

    // Ma'lumotlar yuklanayotgan bo'lsa kutamiz
    if (loading) return (
        <div className="flex justify-center h-screen items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    // Kirilmagan bo'lsa login sahifasiga
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin bo'lmasa asosiy sahifaga
    if (!user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute; // default export qilishni unutmang