import expres from "express";
import { login, changePassword, verifyToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = expres.Router();

router.post("/login", login);
router.get("/verify", verifyToken);
router.put("/change-password", authenticateToken, changePassword);

export default router;

