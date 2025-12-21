import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Helper function to generate JWT token
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username va password talab qilinadi" });
    }

    // Get admin from database
    const admins = await sql`
      SELECT * FROM admins WHERE username = ${username}
    `;

    if (admins.length === 0) {
      return res.status(401).json({ success: false, message: "Foydalanuvchi nomi yoki parol noto'g'ri" });
    }

    const admin = admins[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Foydalanuvchi nomi yoki parol noto'g'ri" });
    }

    // Generate token
    const token = generateToken(admin.id);

    res.status(200).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
    });
  } catch (error) {
    console.log("Error in login function", error);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.adminId; // Set by auth middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Joriy va yangi parol talab qilinadi" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Yangi parol kamida 6 belgi bo'lishi kerak" });
    }

    // Get admin
    const admins = await sql`
      SELECT * FROM admins WHERE id = ${adminId}
    `;

    if (admins.length === 0) {
      return res.status(404).json({ success: false, message: "Admin topilmadi" });
    }

    const admin = admins[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Joriy parol noto'g'ri" });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await sql`
      UPDATE admins 
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${adminId}
    `;

    res.status(200).json({
      success: true,
      message: "Parol muvaffaqiyatli o'zgartirildi",
    });
  } catch (error) {
    console.log("Error in changePassword function", error);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token talab qilinadi" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if admin exists
      const admins = await sql`
        SELECT id, username FROM admins WHERE id = ${decoded.id}
      `;

      if (admins.length === 0) {
        return res.status(401).json({ success: false, message: "Admin topilmadi" });
      }

      res.status(200).json({
        success: true,
        data: {
          admin: admins[0],
        },
      });
    } catch (jwtError) {
      return res.status(401).json({ success: false, message: "Token yaroqsiz yoki muddati o'tgan" });
    }
  } catch (error) {
    console.log("Error in verifyToken function", error);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

