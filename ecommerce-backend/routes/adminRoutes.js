const express = require("express");
const router = express.Router();

// IMPORT MIDDLEWARE AND CONTROLLERS
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");
const {
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  deleteOrder
} = require("../controllers/adminController");

// PROTECT ROUTES: auth + admin
router.use(authMiddleware, isAdmin); // <- THIS LINE CRASHES IF IMPORT IS WRONG

router.patch("/orders/:id/status", updateOrderStatus);
router.get("/customers", getAllCustomers);
router.delete("/orders/:id", deleteOrder);

module.exports = router;