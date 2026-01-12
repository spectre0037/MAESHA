const db = require("../config/db");

/**
 * @desc Create Order (with Delivery Info & Payment Proof)
 * @access Private (Customer)
 */
exports.addOrder = async (req, res, next) => {
  const client = await db.pool.connect(); 
  try {
    let { items, address, phone_number, payment_screenshot } = req.body;
    const userId = req.user.id;

    const finalScreenshot = req.file ? req.file.path : payment_screenshot;
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    if (!parsedItems || parsedItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!address || !phone_number) {
      return res.status(400).json({ success: false, message: "Address and phone are required" });
    }
    if (!finalScreenshot) {
      return res.status(400).json({ success: false, message: "Payment proof is required" });
    }

    await client.query("BEGIN"); 

    let totalAmount = 0;

    for (const item of parsedItems) {
      const productRes = await client.query(
        "SELECT price, stock, name FROM products WHERE id = $1 FOR UPDATE", 
        [item.id]
      );
      const product = productRes.rows[0];

      if (!product) throw new Error(`Product with ID ${item.id} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, address, phone_number, payment_screenshot) 
       VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING id`,
      [userId, totalAmount, address, phone_number, finalScreenshot]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of parsedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
         VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))`,
        [orderId, item.id, item.quantity]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ success: true, message: "Order placed successfully!", orderId });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER_ERROR:", err.message);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * @desc Admin: List All Orders with Customer Details
 * @access Private (Admin Only)
 */
exports.listAllOrders = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin: Update Order Status
 * @access Private (Admin Only)
 */
exports.changeOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Log this to your terminal so you can see it in VS Code
    console.log(`Attempting to update Order ${id} to status: ${status}`);

    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found in database" });
    }

    res.json({ 
      success: true, 
      message: "Order status updated", 
      order: result.rows[0] 
    });
  } catch (err) {
    // This logs the specific DB error to your backend console
    console.error("DATABASE_UPDATE_ERROR:", err); 
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

/**
 * @desc Delete Order (Admin Only)
 */
exports.deleteOrder = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    // 1. Check if order exists
    const orderCheck = await client.query("SELECT id FROM orders WHERE id = $1", [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 2. Delete items, then the order
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    await client.query("DELETE FROM orders WHERE id = $1", [id]);

    await client.query("COMMIT");
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

/**
 * @desc Admin/User: Get Specific Order Items
 */
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json({ success: true, items: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.listUserOrders = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as total_items
       FROM orders o 
       WHERE o.user_id = $1 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.getOrdersByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      `SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o 
       WHERE o.user_id = $1 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    next(err);
  }
};