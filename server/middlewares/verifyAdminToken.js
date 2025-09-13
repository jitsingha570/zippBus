const jwt = require("jsonwebtoken");

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid admin token" });
    }

    req.user = decoded; // { id, role }
    next();
  });
};

module.exports = verifyAdminToken;
