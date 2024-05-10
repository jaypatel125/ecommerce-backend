import express from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  getCategories,
  getCategoryById,
} from "../controllers/categoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);
router.route("/categories").get(getCategories);
router.route("/:id").get(getCategoryById);
export default router;
