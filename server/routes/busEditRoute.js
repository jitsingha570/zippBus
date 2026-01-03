const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken"); // middleware to check admin

const {
  getBusById,
  createEditRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/busEditController");

// BASE: /api/bus-edit

// Get bus details
router.get("/:busId", verifyToken, getBusById);

// User creates edit requests
// Create an edit request. Body should include { type: 'ADD'|'UPDATE'|'DELETE', stoppageId?, data? }
router.post("/:busId/stoppages", verifyToken, createEditRequest);
// For convenience set the type and stoppageId from params then forward to createEditRequest
router.put(
  "/:busId/stoppages/:sid",
  verifyToken,
  (req, res, next) => {
    req.body.type = "UPDATE";
    req.body.stoppageId = req.params.sid;
    next();
  },
  createEditRequest
);
router.delete(
  "/:busId/stoppages/:sid",
  verifyToken,
  (req, res, next) => {
    req.body.type = "DELETE";
    req.body.stoppageId = req.params.sid;
    next();
  },
  createEditRequest
);

// Admin routes
router.get("/requests/all",  verifyAdminToken, getPendingRequests); // get all pending requests
router.put("/requests/:id/approve",  verifyAdminToken, approveRequest);
router.put("/requests/:id/reject",  verifyAdminToken, rejectRequest);

module.exports = router;
