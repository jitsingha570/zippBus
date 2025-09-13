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
  getBusDetails
} = require("../controllers/busController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdminToken = require("../middlewares/verifyAdminToken");
const adminOnly = require("../middlewares/adminOnly");
//const adminOnly = require("../middlewares/adminOnly");

const router = express.Router();

// -------------------------
// USER ROUTES
// -------------------------
router.post("/request", verifyToken, requestBus); // user submits request
router.get("/search", searchBus); // public route to search buses
router.get('/my-buses', verifyToken, getMyBuses);

router.put('/:busId', verifyToken, updateBus);
router.get('/:busId', verifyToken, getBusDetails);
// -------------------------
// ADMIN ROUTES
// -------------------------
router.get("/",  getAllBuses);
router.get("/routes", verifyAdminToken,adminOnly, getAllRoutes);
router.get("/requests",verifyAdminToken,adminOnly,  getAllBusRequests);
router.put("/approve/:id", verifyAdminToken,adminOnly,approveBusRequest);
router.put("/reject/:id", verifyAdminToken, adminOnly,rejectBusRequest);

module.exports = router;
