const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // We only include necessary, non-sensitive data in the payload
  const payload = {
    id: user.id,
    role: user.role, // 'admin' or 'customer'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // This allows us to handle expired or tampered tokens specifically
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};