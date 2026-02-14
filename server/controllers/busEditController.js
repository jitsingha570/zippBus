const Bus = require("../models/busModel");
const BusEditRequest = require("../models/BusEditRequestModel");

// ============================
// USER: CREATE EDIT REQUEST
// ============================
const createEditRequest = async (req, res) => {
  try {
    const { actionType, stoppageId, requestedData } = req.body;
    const { busId } = req.params;

    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: "actionType is required",
      });
    }

    const request = await BusEditRequest.create({
      busId,
      requestedBy: req.user.id,
      actionType,
      stoppageId: stoppageId || null,
      requestedData: requestedData || null,
    });

    res.status(201).json({
      success: true,
      message: "Edit request submitted for admin approval",
      request,
    });
  } catch (err) {
    console.error("Create Edit Request Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ============================
// ADMIN: GET ALL PENDING REQUESTS
// ============================
const getPendingRequests = async (req, res) => {
  try {
    const requests = await BusEditRequest.find({ status: "PENDING" })
      .populate("busId", "busName busNumber")
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// ADMIN: APPROVE REQUEST
// ============================
const approveRequest = async (req, res) => {
  try {
    const request = await BusEditRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const bus = await Bus.findById(request.busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // ========================
    // APPLY REQUEST
    // ========================

    // 🔹 BUS LEVEL UPDATE
    if (request.actionType === "UPDATE_BUS") {
      const forbiddenFields = ["busNumber", "owner", "_id"];
      forbiddenFields.forEach(f => delete request.requestedData[f]);

      Object.assign(bus, request.requestedData);
    }

    // 🔹 ADD STOPPAGE
    if (request.actionType === "ADD_STOPPAGE") {
      bus.stoppages.push(request.requestedData);
    }

    // 🔹 UPDATE STOPPAGE
    if (request.actionType === "UPDATE_STOPPAGE") {
      const stoppage = bus.stoppages.id(request.stoppageId);
      if (!stoppage) {
        return res.status(404).json({ message: "Stoppage not found" });
      }
      Object.assign(stoppage, request.requestedData);
    }

    // 🔹 DELETE STOPPAGE
    if (request.actionType === "DELETE_STOPPAGE") {
      bus.stoppages = bus.stoppages.filter(
        s => s._id.toString() !== request.stoppageId.toString()
      );
    }

    // Sort stoppages by order
    bus.stoppages.sort((a, b) => a.order - b.order);
    await bus.save();

    request.status = "APPROVED";
    request.reviewedBy = req.user.id;
    await request.save();

    res.json({
      success: true,
      message: "Request approved and applied successfully",
      bus,
    });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// ADMIN: REJECT REQUEST
// ============================
const rejectRequest = async (req, res) => {
  try {
    const { remark } = req.body;

    const request = await BusEditRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "REJECTED";
    request.adminRemark = remark || "Rejected by admin";
    request.reviewedBy = req.user.id;
    await request.save();

    res.json({
      success: true,
      message: "Request rejected successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// GET BUS DETAILS
// ============================
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.json({ success: true, bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createEditRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getBusById,
};
