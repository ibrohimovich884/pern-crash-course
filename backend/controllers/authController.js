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
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Email va parol kiriting" });
		}

		// 1. Foydalanuvchini bazadan qidirish
		const users = await sql`SELECT * FROM users WHERE email = ${email}`;
		let user;

		if (users.length === 0) {
			// 2. RO'YXATDAN O'TISH (Agar foydalanuvchi topilmasa)
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const newUsers = await sql`
        INSERT INTO users (email, password_hash, is_admin) 
        VALUES (${email}, ${hashedPassword}, FALSE) 
        RETURNING id, email, is_admin
      `;
			user = newUsers[0];
			console.log("Yangi foydalanuvchi ochildi:", email);
		} else {
			// 3. LOGIN (Agar foydalanuvchi mavjud bo'lsa)
			user = users[0];
			const isMatch = await bcrypt.compare(password, user.password_hash);
			if (!isMatch) {
				return res.status(401).json({ success: false, message: "Parol noto'g'ri" });
			}
		}

		// 4. JWT Token yaratish
		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				// user.is_admin true bo'lsa 'admin', aks holda 'user'
				role: user.is_admin ? 'admin' : 'user'
			},
			JWT_SECRET,
			{ expiresIn: "7d" }
		);
		
		res.status(200).json({
			success: true,
			data: {
				token,
				user: {
					id: user.id,
					email: user.email,
					role: user.is_admin ? 'admin' : 'user'
				}
			}
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Serverda xatolik" });
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
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) return res.status(401).json({ success: false });

		const decoded = jwt.verify(token, JWT_SECRET);
		const users = await sql`SELECT id, email, is_admin FROM users WHERE id = ${decoded.id}`;

		if (users.length === 0) return res.status(401).json({ success: false });

		res.json({ success: true, data: { user: { ...users[0], isAdmin: users[0].is_admin } } });
	} catch (error) {
		res.status(401).json({ success: false });
	}
};



