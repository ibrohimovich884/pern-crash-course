import expres from "express";
import {
  createBanner,
  deleteBanner,
  getBanner,
  getBanners,
  getAllBanners,
  updateBanner,
} from "../controllers/bannerController.js";

const router = expres.Router();

router.get("/", getBanners); // Public route - only active banners
router.get("/all", getAllBanners); // Admin route - all banners
router.get("/:id", getBanner);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;
