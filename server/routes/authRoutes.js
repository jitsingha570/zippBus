const express = require('express');
const router = express.Router();
const { register, verifyOTP, resendOTP, login , getProfile , updateProfile , getUserStats } = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/register', register);
router.post('/verify', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/stats", authMiddleware, getUserStats);


module.exports = router;
