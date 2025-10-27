// middleware/verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using secret from env or fallback
    const secret = process.env.JWT_SECRET || "dev_secret_key";
    const decoded = jwt.verify(token, secret);

    // Attach decoded user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
