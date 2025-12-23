import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

      req.adminId = decoded.id;
      next();
    });
  } catch (error) {
    console.log("Error in authenticateToken middleware", error);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
};



