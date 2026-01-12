const express = require("express");
const {
  addOrder,
  listUserOrders,
  listAllOrders,
  changeOrderStatus,
  deleteOrder,
  getOrderDetails,
  getOrdersByUserId
} = require("../controllers/orderController");
const upload = require('../middleware/upload');
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// --- CUSTOMER ROUTES ---
router.post("/", authMiddleware, upload.single('payment_screenshot'), addOrder);
router.get("/my-orders", authMiddleware, listUserOrders);

// --- ADMIN ROUTES ---

// 1. Get all orders (Keep this as is)
router.get("/admin/all", authMiddleware, isAdmin, listAllOrders);

// 2. Update status - CHANGED to match Frontend: API.put("/orders/admin/${order.id}/status")
router.put("/admin/:id/status", authMiddleware, isAdmin, changeOrderStatus);

// 3. Delete order - CHANGED to match Frontend: API.delete("/orders/admin/${order.id}")
router.delete("/admin/:id", authMiddleware, isAdmin, deleteOrder);

// 4. Get items for an order
router.get("/:id/items", authMiddleware, isAdmin, getOrderDetails);

// 5. Get orders for specific user
router.get("/admin/user/:userId", authMiddleware, isAdmin, getOrdersByUserId);

module.exports = router;