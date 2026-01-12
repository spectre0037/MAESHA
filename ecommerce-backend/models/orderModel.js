const pool = require("../config/db");

// Create Order
const createOrder = async (user_id, product_id, quantity, total_price) => {
  const result = await pool.query(
    `INSERT INTO orders (user_id, product_id, quantity, total_price) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, product_id, quantity, total_price]
  );
  return result.rows[0];
};

// Get Orders by User
const getOrdersByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT o.*, p.name AS product_name, p.price AS product_price 
     FROM orders o 
     JOIN products p ON o.product_id = p.id 
     WHERE o.user_id=$1 ORDER BY o.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get All Orders (Admin)
const getAllOrders = async () => {
  const result = await pool.query(
    `SELECT o.*, u.name AS user_name, p.name AS product_name 
     FROM orders o 
     JOIN users u ON o.user_id = u.id 
     JOIN products p ON o.product_id = p.id 
     ORDER BY o.created_at DESC`
  );
  return result.rows;
};

// Update Order Status (Admin)
const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};
//Delete order
const deleteOrder = async (id) => {
  const result = await pool.query(
    `DELETE FROM orders WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};
