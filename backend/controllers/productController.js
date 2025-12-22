import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  // 1. Endi stock va descriptionni ham req.body'dan olamiz
  const { name, price, image, stock, description } = req.body;

  // 2. Validatsiya (hamma maydonlar to'ldirilganini tekshirish)
  if (!name || !price || !image || stock === undefined || !description) {
    return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldirish majburiy!" });
  }

  try {
    // 3. SQL so'roviga yangi ustunlarni qo'shamiz
    const newProduct = await sql`
      INSERT INTO products (name, price, image, stock, description)
      VALUES (${name}, ${price}, ${image}, ${stock}, ${description})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
      SELECT * FROM products WHERE id=${id}
    `;
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  // 4. Update qismida ham yangi maydonlarni qabul qilamiz
  const { name, price, image, stock, description } = req.body;

  try {
    // 5. SET qismiga yangi ustunlarni qo'shib chiqamiz
    const updatedProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}, stock=${stock}, description=${description}
      WHERE id=${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id=${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};