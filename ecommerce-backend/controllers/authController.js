const db = require("../config/db");
const bcrypt = require("bcryptjs"); // Standard for PERN
const { generateToken } = require("../utils/jwt");

// Efficiency: Use a salt rounds variable for bcrypt
const SALT_ROUNDS = 10;

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // 2. Check if user exists (Efficiency: only select 1 column)
    const userExists = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user and return the data in one query (using RETURNING)
    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email.toLowerCase(), hashedPassword]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      token: generateToken(user), // Optional: auto-login after register
    });
  } catch (error) {
    next(error); // Pass to our global error handler in server.js
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // 1. Find user
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = result.rows[0];

    // 2. Security: Use generic "Invalid credentials" to prevent email harvesting
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 4. Generate token and send response
    const token = generateToken(user);

    // Remove password from object before sending
    delete user.password;

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent admin from deleting themselves (optional but recommended)
    if (id == req.user.id) return res.status(400).json({ message: "You cannot delete yourself" });

    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing user" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  deleteUser,
};