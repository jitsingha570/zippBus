const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

const {
  getBusById,
  createEditRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/busEditController");

/*
 BASE PATH: /api/bus-edit
*/

// ============================
// ADMIN ROUTES (KEEP ON TOP)
// ============================

// Get all pending edit requests
router.get(
  "/requests",
  verifyAdminToken,
  getPendingRequests
);

// Approve edit request
router.put(
  "/requests/:id/approve",
  verifyAdminToken,
  approveRequest
);

// Reject edit request
router.put(
  "/requests/:id/reject",
  verifyAdminToken,
  rejectRequest
);

// ============================
// USER ROUTES
// ============================

// Get bus details (for edit page)
router.get(
  "/:busId",
  verifyToken,
  getBusById
);

// ----------------------------
// CREATE EDIT REQUESTS
// ----------------------------

// ADD new stoppage
router.post(
  "/:busId/stoppages",
  verifyToken,
  (req, res, next) => {
    req.body.actionType = "ADD";
    next();
  },
  createEditRequest
);

// UPDATE existing stoppage
router.put(
  "/:busId/stoppages/:sid",
  verifyToken,
  (req, res, next) => {
    req.body.actionType = "UPDATE";
    req.body.stoppageId = req.params.sid;
    next();
  },
  createEditRequest
);

// DELETE stoppage
router.delete(
  "/:busId/stoppages/:sid",
  verifyToken,
  (req, res, next) => {
    req.body.actionType = "DELETE";
    req.body.stoppageId = req.params.sid;
    next();
  },
  createEditRequest
);

module.exports = router;
