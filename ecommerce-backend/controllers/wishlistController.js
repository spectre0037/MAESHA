const db = require("../config/db");

// GET all items in user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT p.* FROM products p 
       JOIN wishlist w ON p.id = w.product_id 
       WHERE w.user_id = $1`, 
      [userId]
    );
    res.json({ success: true, wishlist: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TOGGLE (Add if doesn't exist, Remove if it does)
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const check = await db.query(
      "SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (check.rows.length > 0) {
      await db.query("DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2", [userId, productId]);
      res.json({ success: true, isWishlisted: false });
    } else {
      await db.query("INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)", [userId, productId]);
      res.json({ success: true, isWishlisted: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};