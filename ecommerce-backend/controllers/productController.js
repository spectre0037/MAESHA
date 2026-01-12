const db = require("../config/db");

/**
 * @desc Get all products with Pagination, Filtering, and Ratings
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Use LEFT JOIN to get review stats without losing products that have 0 reviews
    let query = `
      SELECT p.*, 
             COUNT(r.id) AS review_count, 
             COALESCE(AVG(r.rating), 0)::NUMERIC(10,1) AS avg_rating,
             count(*) OVER() AS total_count 
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE 1=1
    `;
    
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    // Grouping is required when using aggregate functions like AVG and COUNT
    query += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    const totalItems = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      products: result.rows,
      pagination: { totalItems, totalPages, currentPage: parseInt(page) }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single product with detailed rating
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT p.*, 
              COUNT(r.id) AS review_count, 
              COALESCE(AVG(r.rating), 0)::NUMERIC(10,1) AS avg_rating
       FROM products p
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.id = $1
       GROUP BY p.id`, 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Add product
 */
const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount_price, category, stock, image_url } = req.body;
    const finalImageUrl = req.file ? req.file.path : image_url;

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    
    const finalDiscount = discount_price === "" || discount_price === undefined ? null : discount_price;

    const result = await db.query(
      `INSERT INTO products (name, description, price, discount_price, category, image_url, stock) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, finalDiscount, category || 'General', finalImageUrl, stock || 0]
    );
    
    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update product
 */
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, discount_price, stock, category, image_url } = req.body;

  try {
    const finalImageUrl = req.file ? req.file.path : image_url;
    const finalDiscount = discount_price === "" ? null : discount_price;

    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, discount_price = $4, stock = $5, category = $6, image_url = $7 
       WHERE id = $8 RETURNING *`,
      [name, description, price, finalDiscount, stock, category || 'General', finalImageUrl, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Dynamic EDIT
 */
const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) return res.status(400).json({ message: "No fields to update" });

    if (fields.hasOwnProperty('discount_price') && fields.discount_price === "") fields.discount_price = null;

    const keys = Object.keys(fields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(fields);
    values.push(id);

    const query = `UPDATE products SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);

    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc DELETE product
 */
const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get unique categories
 */
const getCategories = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category ASC"
    );
    const categories = result.rows.map(row => row.category);
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  addProduct, 
  editProduct, 
  removeProduct, 
  updateProduct, 
  getCategories 
};