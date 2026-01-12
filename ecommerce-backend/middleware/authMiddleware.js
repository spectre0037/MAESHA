const { verifyToken } = require("../utils/jwt");

/**
 * Authentication Middleware
 * Validates JWT tokens for protected routes
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if the header exists and follows the 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in." 
      });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Malformed token. Access denied." 
      });
    }

    // 3. Verify token
    // decoded typically contains { id: 1, role: 'customer', iat: ..., exp: ... }
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token payload." 
      });
    }

    // 4. Attach user info to request
    // This allows subsequent controllers to use req.user.id and req.user.role
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    // 5. Production-ready error messages
    let message = "Unauthorized access";
    
    if (err.name === "TokenExpiredError") {
      message = "Session expired. Please log in again.";
    } else if (err.name === "JsonWebTokenError") {
      message = "Invalid session. Please log in again.";
    }

    console.error(`[Auth Error]: ${err.message}`);
    
    return res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

module.exports = authMiddleware;