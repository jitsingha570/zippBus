const express = require("express");
const router = express.Router();

const {
  getSearchCount,
  getBusCount,
  getUserCount,
  getPendingBusCount
} = require("../controllers/countsController");

const verifyAdminToken = require("../middlewares/verifyAdminToken");

// Public routes
router.get("/search", getSearchCount);
router.get("/buses", getBusCount);
router.get("/users", getUserCount);

// Admin-only route
router.get("/pending-buses", verifyAdminToken, getPendingBusCount);

module.exports = router;
