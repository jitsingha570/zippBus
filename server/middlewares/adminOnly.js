// middleware/adminOnly.js

const adminOnly = (req, res, next) => {
  try {
    // Support multiple verification middleware styles
    const adminData = req.admin || req.user;

    if (!adminData) {
      console.log("❌ Admin access denied: No token data found");
      return res.status(403).json({ 
        error: "Access denied. Token missing or invalid." 
      });
    }

    if (!adminData.role || adminData.role !== "admin") {
      console.log("❌ Admin access denied: Role is not admin");
      return res.status(403).json({ 
        error: "Access denied. Admins only." 
      });
    }

    console.log("✅ Admin access granted:", adminData.email || adminData.id);
    next();
    
  } catch (error) {
    console.error("🔥 adminOnly middleware error:", error);
    return res.status(500).json({ 
      error: "Server error in admin access check." 
    });
  }
};

module.exports = adminOnly;
