const Bus = require("../models/busModel");
const BusEditRequest = require("../models/BusEditRequestModel");

// ============================
// USER SIDE: CREATE EDIT REQUEST
// ============================
const createEditRequest = async (req, res) => {
  try {
    const { type, stoppageId, data } = req.body; // ADD | UPDATE | DELETE
    const busId = req.params.busId;

    const request = await BusEditRequest.create({
      busId,
      requestedBy: req.user.id,
      type,
      stoppageId: stoppageId || null,
      data: data || null,
    });

    res.json({
      success: true,
      message: "Edit request submitted for admin approval",
      request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// ADMIN SIDE: GET ALL PENDING REQUESTS
// ============================
const getPendingRequests = async (req, res) => {
  try {
    const requests = await BusEditRequest.find({ status: "PENDING" })
      .populate("busId requestedBy");

    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// ADMIN APPROVE REQUEST
// ============================
const approveRequest = async (req, res) => {
  try {
    const request = await BusEditRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const bus = await Bus.findById(request.busId);

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // APPLY THE CHANGE
    if (request.type === "ADD") {
      bus.stoppages.push(request.data);
    }

    if (request.type === "UPDATE") {
      const stoppage = bus.stoppages.id(request.stoppageId);
      if (!stoppage)
        return res.status(404).json({ message: "Stoppage not found" });
      Object.assign(stoppage, request.data);
    }

    if (request.type === "DELETE") {
      bus.stoppages = bus.stoppages.filter(
        s => s._id.toString() !== request.stoppageId.toString()
      );
    }

    bus.stoppages.sort((a, b) => a.order - b.order);
    await bus.save();

    request.status = "APPROVED";
    await request.save();

    res.json({ success: true, message: "Request approved and applied", bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// ADMIN REJECT REQUEST
// ============================
const rejectRequest = async (req, res) => {
  try {
    const { remark } = req.body;

    const request = await BusEditRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "REJECTED";
    request.adminRemark = remark || "Rejected by admin";
    await request.save();

    res.json({ success: true, message: "Request rejected" });
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
      return res.status(404).json({ success: false, message: "Bus not found" });
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