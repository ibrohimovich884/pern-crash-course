import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// 1. Foydalanuvchi tizimga kirganini tekshirish (Tokenni dekodlash)
export const authenticateToken = (req, res, next) => {


    try {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ success: false, message: "Token talab qilinadi" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Token yaroqsiz yoki muddati o'tgan" });
            }

            // MUHIM: decoded ichidagi ma'lumotni req.user ga yuklaymiz
            // Shunda keyingi funksiyalarda req.user.id va req.user.role mavjud bo 'ladi
            req.user = decoded;
            next();
        });

    } catch (error) {

        console.log("Error in authenticateToken middleware", error);
        res.status(500).json({ success: false, message: "Server xatosi" });
    }
};

// 2. Admin ekanligini tekshirish

export const isAdmin = (req, res, next) => {
    // Kontrollerda role: 'admin' deb yozganimiz uchun endi bu shart bajariladi
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Kirish taqiqlangan: Siz admin emassiz!"
        });
    }
};