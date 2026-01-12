const db = require("../config/db");

// @desc Add a review (Verified Buyers Only)
exports.addReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // 1. Check if the user has a DELIVERED order for this specific product
    // We join orders and order_items to verify the purchase
    const purchaseCheck = await db.query(
      `SELECT oi.id 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 
       AND oi.product_id = $2 
       AND o.status = 'delivered'`,
      [user_id, product_id]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Only verified buyers who have received this product can leave a review." 
      });
    }

    // 2. Proceed to insert review if check passes
    const result = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [product_id, user_id, rating, comment]
    );

    res.status(201).json({ 
      success: true, 
      message: "Review added successfully", 
      review: result.rows[0] 
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }
    next(err);
  }
};

// @desc Get reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await db.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = $1 
       ORDER BY r.created_at DESC`,
      [productId]
    );
    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    next(err);
  }
};

// @desc Delete review (Admin only)
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
    }
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};