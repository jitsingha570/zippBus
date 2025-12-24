const express = require("express");
const {
  requestAdminRegistration,
  verifyAdminOTPs,
  loginAdmin,
} = require("../controllers/adminAuthController");

const router = express.Router();

// 🔓 PUBLIC ROUTES (NO AUTH)
router.post("/register/request", requestAdminRegistration);
router.post("/register/verify", verifyAdminOTPs);
router.post("/login", loginAdmin);

module.exports = router;
