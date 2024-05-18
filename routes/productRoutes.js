import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import e from "express";

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.route("/top").get(fetchTopProducts);

router.route("/new").get(fetchNewProducts);

router.route("/filterd-products").post(filterProducts);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, formidable(), checkId, updateProduct)
  .get(fetchProductById)
  .delete(authenticate, authorizeAdmin, deleteProduct);

export default router;
