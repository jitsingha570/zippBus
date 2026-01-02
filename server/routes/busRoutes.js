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
  searchBusByNameOrNumber
} = require("../controllers/busController");
const {getAllBusUpdateRequests, approveBusUpdateRequest, rejectBusUpdateRequest} = require("../controllers/adminBusRequestController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

const router = express.Router();

// -------------------------
// USER ROUTES
// -------------------------
router.post("/request", verifyToken, requestBus);
router.get("/search", searchBus);
router.get("/search-by-name-or-number", searchBusByNameOrNumber);

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
router.put("/:busNumber", verifyToken, updateBus);
router.get("/:busNumber", verifyToken, getBusDetails);

//-------------------------
//admin can : approve/reject bus  update requests
//-------------------------
router.get("/updates", verifyAdminToken, getAllBusUpdateRequests);
router.put("/updateApprove/:id", verifyAdminToken, approveBusUpdateRequest);
router.put("/updateReject/:id", verifyAdminToken, rejectBusUpdateRequest);


module.exports = router;

