import { useEffect } from "react"; // useEffect qo'shildi
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// STORES
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

// COMPONENTS
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute"; // Buni hozir yaratdik

// PAGES
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";

// ADMIN PAGES
import AdminHomePage from "./pages/AdminHomePage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminBannersPage from "./pages/AdminBannersPage";
import AdminBannerPage from "./pages/AdminBannerPage";
import AdminOrderPage from "./pages/AdminOrderPage";

function App() {
	const { theme } = useThemeStore();
	const { verifyToken, loading } = useAuthStore();

	// Sahifa har safar yuklanganda tokenni tekshirish
	useEffect(() => {
		verifyToken();
	}, [verifyToken]);

	// Agar token tekshirilayotgan bo'lsa, "Loading" ko'rsatib turamiz
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-base-200" data-theme={theme}>
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
			<Navbar />

			<Routes>
				{/* CLIENT ROUTES */}
				<Route path="/" element={<HomePage />} />
				<Route path="/product/:id" element={<ProductPage />} />
				<Route path="/cart" element={<CartPage />} />

				<Route path="/checkout" element={<CheckoutPage />} />

				{/* AUTH */}
				<Route path="/login" element={<LoginPage />} />

				{/* ADMIN ROUTES - Hammasi AdminRoute bilan himoyalandi */}
				<Route
					path="/admin"
					element={
						<AdminRoute>
							<AdminHomePage />
						</AdminRoute>
					}
				/>
				<Route
					path="/admin/product/:id"
					element={
						<AdminRoute>
							<AdminProductPage />
						</AdminRoute>
					}
				/>
				<Route
					path="/admin/banners"
					element={
						<AdminRoute>
							<AdminBannersPage />
						</AdminRoute>
					}
				/>
				<Route
					path="/admin/banner/:id"
					element={
						<AdminRoute>
							<AdminBannerPage />
						</AdminRoute>
					}
				/>
			<Route
				path="/admin/orders"
				element={
					<AdminRoute>
						<AdminOrderPage />
					</AdminRoute>
				}
			/>
			</Routes>

			<Toaster />
		</div>
	);
}

export default App;