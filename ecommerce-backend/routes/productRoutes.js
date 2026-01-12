const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
  getCategories // Imported correctly
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// --- Public Routes ---

// 1. Specific static routes MUST come before dynamic /:id routes
router.get("/categories", getCategories); 

// 2. GET /api/products
router.get("/", getAllProducts); 

// 3. GET /api/products/:id
router.get("/:id", getProductById);

// --- Admin Routes ---

// POST /api/products
router.post("/", authMiddleware, isAdmin, addProduct);

// PUT /api/products/:id
router.put("/:id", authMiddleware, isAdmin, updateProduct);

// DELETE /api/products/:id
router.delete("/:id", authMiddleware, isAdmin, removeProduct);

module.exports = router;