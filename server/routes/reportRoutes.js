const express = require("express");
const router = express.Router();
const {
  submitReport,
  getMyReports,
  getAllReports,
  updateReportStatus
} = require("../controllers/reportController");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");
const adminOnly = require("../middlewares/adminOnly");
//const adminOnly = require("../middlewares/adminOnly");


// User Routes
router.post("/submit", verifyToken, submitReport);
router.get("/my-reports", verifyToken, getMyReports);

// Admin Routes
router.get("/", verifyAdminToken, adminOnly, getAllReports);
router.patch("/:id/status", verifyAdminToken, adminOnly, updateReportStatus);

module.exports = router;
