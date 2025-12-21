import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminBannersPage from "./pages/AdminBannersPage";
import AdminBannerPage from "./pages/AdminBannerPage";
import LoginPage from "./pages/LoginPage";

import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        {/* CLIENT ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute>
              <AdminProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute>
              <AdminBannersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banner/:id"
          element={
            <ProtectedRoute>
              <AdminBannerPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
