import { sql } from "../config/db.js";

export const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, deliveryMethod, phoneNumber, address } = req.body;

        // authenticateToken bizga req.user ni beradi
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Savat bo'sh!" });
        }

        // Buyurtmani bazaga kiritish (JSON.stringify muhim!)
        const newOrder = await sql`
            INSERT INTO orders (user_id, items, total_price, delivery_method, phone_number, address, status)
            VALUES (${userId}, ${JSON.stringify(items)}, ${totalPrice}, ${deliveryMethod}, ${phoneNumber}, ${address}, 'pending')
            RETURNING *
        `;

        res.status(201).json({
            success: true,
            message: "Buyurtma bazaga yozildi!",
            order: newOrder[0]
        });
    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);
        res.status(500).json({ success: false, message: "Bazaga yozishda xatolik: " + error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        // Hamma buyurtmalarni foydalanuvchi emaili bilan birga olib kelish
        const orders = await sql`
            SELECT orders.*, users.email 
            FROM orders 
            LEFT JOIN users ON orders.user_id = users.id 
            ORDER BY orders.created_at DESC
        `;

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);
        res.status(500).json({ success: false, message: "Buyurtmalarni yuklashda xatolik" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await sql`
            UPDATE orders 
            SET status = ${status} 
            WHERE id = ${id} 
            RETURNING *
        `;

        if (updatedOrder.length === 0) {
            return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
        }

        res.json({ success: true, message: "Status yangilandi", data: updatedOrder[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xatolik yuz berdi" });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await sql`
            SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tarixni yuklashda xatolik" });
    }
};