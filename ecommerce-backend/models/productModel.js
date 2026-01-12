const pool = require("../config/db");

// Create Product
const createProduct = async (name, description, price, discount_price, category, image_url, stock) => {
  // Ensure discount_price is null if not provided
  const finalDiscount = discount_price === "" || discount_price === undefined ? null : discount_price;

  const result = await pool.query(
    `INSERT INTO products (name, description, price, discount_price, category, image_url, stock) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, price, finalDiscount, category || 'General', image_url, stock || 0]
  );
  return result.rows[0];
};

// Get All Products (Internal Model Helper)
const getAllProducts = async () => {
  const result = await pool.query(`SELECT * FROM products ORDER BY created_at DESC`);
  return result.rows;
};

// Get Product By ID
const getProductById = async (id) => {
  const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return result.rows[0];
};

// Update Product
const editProduct = async (id, name, description, price, discount_price, category, image_url, stock) => {
  // Ensure discount_price is null if empty string is passed (ending a sale)
  const finalDiscount = discount_price === "" || discount_price === undefined ? null : discount_price;

  const result = await pool.query(
    `UPDATE products 
     SET name=$1, 
         description=$2, 
         price=$3, 
         discount_price=$4, 
         category=$5, 
         image_url=$6, 
         stock=$7, 
         updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [name, description, price, finalDiscount, category || 'General', image_url, stock, id]
  );
  return result.rows[0];
};

// Delete Product
const deleteProduct = async (id) => {
  // Using RETURNING id helps confirm the deletion happened
  const result = await pool.query(`DELETE FROM products WHERE id=$1 RETURNING id`, [id]);
  return result.rows.length > 0;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
};