import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getTotalOrders,
  getTotalSales,
  getTotalSalesByDate,
  getOrderById,
  payOrder,
  deliverOrder,
} from "../controllers/orderController.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(authenticate, authorizeAdmin, getTotalOrders);
router.route("/total-sales").get(authenticate, authorizeAdmin, getTotalSales);
router
  .route("/total-sales-by-date")
  .get(authenticate, authorizeAdmin, getTotalSalesByDate);

router.route("/:id").get(authenticate, getOrderById);

router.route("/:id/pay").put(authenticate, payOrder);

router.route("/:id/deliver").put(authenticate, authorizeAdmin, deliverOrder);

export default router;
