import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        link VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create default admin if not exists (username: admin, password: admin123)
    const existingAdmins = await sql`SELECT * FROM admins WHERE username = 'admin'`;
    
    if (existingAdmins.length === 0) {
      const saltRounds = 10;
      const defaultPassword = await bcrypt.hash("admin123", saltRounds);
      
      await sql`
        INSERT INTO admins (username, password_hash)
        VALUES ('admin', ${defaultPassword})
      `;
      
      console.log("Default admin created: username=admin, password=admin123");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});



// import { sql } from "../config/db.js";

// export async function seedProducts() {
//   try {
//     await sql`
//       INSERT INTO products (name, image, price)
//       VALUES
//         ('Apple', 'apple.jpg', 12000),
//         ('Banana', 'banana.jpg', 9000),
//         ('Orange', 'orange.jpg', 15000)
//     `;

//     console.log("Data seeded ✅");
//   } catch (err) {
//     console.error("Seed error ❌", err);
//   }
// }
