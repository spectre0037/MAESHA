const pool = require("../config/db");


// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE orders SET status=$1 WHERE id=$2", [status, id]);
    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await pool.query("DELETE FROM order_items WHERE order_id = $1", [
      req.params.id,
    ]);

    await pool.query("DELETE FROM orders WHERE id = $1", [req.params.id]);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};