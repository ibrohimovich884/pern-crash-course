import { sql } from "../config/db.js";

export const getBanners = async (req, res) => {
  try {
    const banners = await sql`
      SELECT * FROM banners
      WHERE is_active = true
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.log("Error in getBanners function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await sql`
      SELECT * FROM banners
      ORDER BY created_at DESC
    `;

    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.log("Error in getAllBanners function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createBanner = async (req, res) => {
  const { title, image, link, is_active } = req.body;

  if (!title || !image) {
    return res.status(400).json({ success: false, message: "Title and image are required" });
  }

  try {
    const newBanner = await sql`
      INSERT INTO banners (title, image, link, is_active)
      VALUES (${title}, ${image}, ${link || null}, ${is_active !== undefined ? is_active : true})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newBanner[0] });
  } catch (error) {
    console.log("Error in createBanner function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await sql`
      SELECT * FROM banners WHERE id=${id}
    `;

    if (banner.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({ success: true, data: banner[0] });
  } catch (error) {
    console.log("Error in getBanner function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { title, image, link, is_active } = req.body;

  try {
    const updateBanner = await sql`
      UPDATE banners
      SET title=${title}, image=${image}, link=${link || null}, is_active=${is_active !== undefined ? is_active : true}
      WHERE id=${id}
      RETURNING *
    `;

    if (updateBanner.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({ success: true, data: updateBanner[0] });
  } catch (error) {
    console.log("Error in updateBanner function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBanner = await sql`
      DELETE FROM banners WHERE id=${id} RETURNING *
    `;

    if (deletedBanner.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({ success: true, data: deletedBanner[0] });
  } catch (error) {
    console.log("Error in deleteBanner function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
