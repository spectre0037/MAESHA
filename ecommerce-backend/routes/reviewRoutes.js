const express = require("express");
const router = express.Router();
const { addReview, getProductReviews,deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Public: View reviews
router.get("/:productId", getProductReviews);

// Private: Post a review
router.post("/", authMiddleware, addReview);
// Add this line
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;