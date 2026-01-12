/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - List of roles permitted to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Safety check: ensure authMiddleware has already run
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: User information missing" 
      });
    }

    // 2. Check if the user's role is included in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to ${allowedRoles.join(" or ")}` 
      });
    }

    next();
  };
};

// Shortcuts for common roles to keep your routes clean
const isAdmin = authorize('admin');
const isCustomer = authorize('customer');

module.exports = { authorize, isAdmin, isCustomer };