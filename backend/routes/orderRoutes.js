// routes/orderRoutes.js
import express from "express";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
import { createOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// Foydalanuvchi buyurtma berishi (Login qilgan bo'lishi shart)
router.post("/", authenticateToken, createOrder);

// Admin hamma buyurtmalarni ko'rishi
router.get("/all", authenticateToken, isAdmin, getAllOrders);
router.patch("/:id/status", authenticateToken, isAdmin, updateOrderStatus);
export default router;