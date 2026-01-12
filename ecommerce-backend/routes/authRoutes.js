const express = require("express");
const rateLimit = require("express-rate-limit");
const pool = require("../config/db");
const { registerUser, loginUser, deleteUser } = require("../controllers/authController");

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * Security: Rate Limiting
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  message: {
    success: true,
    message: "Too many attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Public Routes ---
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

// --- Admin Only Routes ---

/**
 * @route   GET /api/auth/admin/customers
 * @desc    Get list of all customers for the Admin Dashboard
 * @access  Private (Admin Only)
 */
router.get("/admin/customers", authMiddleware, isAdmin, async (req, res) => {
  try {
    // SQL: Fetch users with role 'customer'
    const customers = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC"
    );
    
    // Efficiency: Wrap the response in an object to match your frontend expectation
    res.status(200).json({
      success: true,
      count: customers.rows.length,
      users: customers.rows // This matches 'customersRes.data.users' in your AdminDashboard
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error while retrieving customer list" 
    });
  }
});

/**
 * @route   DELETE /api/auth/admin/users/:id
 * @desc    Admin can delete a user account
 */
router.delete("/admin/users/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;