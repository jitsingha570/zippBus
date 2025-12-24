const express = require("express");
const {
  requestBus,
  getAllBusRequests,
  approveBusRequest,
  rejectBusRequest,
  searchBus,
  getAllBuses,
  getAllRoutes,
  getMyBuses,
  updateBus,
  getBusDetails,
} = require("../controllers/busController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

const router = express.Router();

// -------------------------
// USER ROUTES
// -------------------------
router.post("/request", verifyToken, requestBus);
router.get("/search", searchBus);
router.get("/my-buses", verifyToken, getMyBuses);

// -------------------------
// ADMIN ROUTES (ONLY ADMIN TOKEN)
// -------------------------
router.get("/requests", verifyAdminToken, getAllBusRequests);
router.put("/approve/:id", verifyAdminToken, approveBusRequest);
router.put("/reject/:id", verifyAdminToken, rejectBusRequest);

router.get("/routes", verifyAdminToken, getAllRoutes);
router.get("/", verifyAdminToken, getAllBuses);

// -------------------------
// DYNAMIC ROUTES (KEEP LAST)
// -------------------------
router.put("/:busId", verifyToken, updateBus);
router.get("/:busId", verifyToken, getBusDetails);

module.exports = router;
