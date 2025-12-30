const BusUpdateRequest = require("../models/busUpdateRequestModel");
const Bus = require("../models/busModel");

/**
 * ======================================
 * GET ALL BUS UPDATE REQUESTS (ADMIN)
 * ======================================
 * Optional query: ?status=pending|approved|rejected
 */
const getAllBusUpdateRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const requests = await BusUpdateRequest.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ======================================
 * APPROVE BUS UPDATE REQUEST (ADMIN)
 * ======================================
 * Updates existing bus OR creates a new bus
 */
const approveBusUpdateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const busUpdateRequest = await BusUpdateRequest.findById(id);
    if (!busUpdateRequest) {
      return res.status(404).json({ message: "Bus update request not found" });
    }

    if (busUpdateRequest.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${busUpdateRequest.status}`,
      });
    }

    let bus = await Bus.findOne({ busNumber: busUpdateRequest.busNumber });

    if (bus) {
      // 🔄 Update existing bus
      bus.busName = busUpdateRequest.busName;
      bus.busType = busUpdateRequest.busType;
      bus.capacity = busUpdateRequest.capacity;
      bus.fare = busUpdateRequest.fare;
      bus.amenities = busUpdateRequest.amenities;
      bus.stoppages = busUpdateRequest.stoppages;
    } else {
      // ➕ Create new bus
      bus = new Bus({
        busName: busUpdateRequest.busName,
        busNumber: busUpdateRequest.busNumber,
        busType: busUpdateRequest.busType,
        capacity: busUpdateRequest.capacity,
        fare: busUpdateRequest.fare,
        amenities: busUpdateRequest.amenities,
        stoppages: busUpdateRequest.stoppages,
        owner: busUpdateRequest.userId, // ✅ required by schema
      });
    }

    await bus.save();

    busUpdateRequest.status = "approved";
    busUpdateRequest.rejectionReason = "";
    await busUpdateRequest.save();

    res.status(200).json({
      success: true,
      message: "Bus update request approved successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ======================================
 * REJECT BUS UPDATE REQUEST (ADMIN)
 * ======================================
 */
const rejectBusUpdateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const busUpdateRequest = await BusUpdateRequest.findById(id);
    if (!busUpdateRequest) {
      return res.status(404).json({
        message: "Bus update request not found",
      });
    }

    if (busUpdateRequest.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${busUpdateRequest.status}`,
      });
    }

    busUpdateRequest.status = "rejected";
    busUpdateRequest.rejectionReason = reason;

    await busUpdateRequest.save();

    res.status(200).json({
      success: true,
      message: "Bus update request rejected successfully",
      reason,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBusUpdateRequests,
  approveBusUpdateRequest,
  rejectBusUpdateRequest,
};
