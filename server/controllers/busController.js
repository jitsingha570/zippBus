const Bus = require("../models/busModel");
const BusRequest = require("../models/busRequestModel"); // ✅ new schema

// -------------------------
// USER: Request to add a bus
// -------------------------
const requestBus = async (req, res) => {
  try {
    const { busName, busNumber, stoppages } = req.body;

    // store in BusRequest instead of Bus
    const newRequest = new BusRequest({
      userId: req.user.id, // from auth middleware
      busName,
      busNumber,
      stoppages
    });

    await newRequest.save();
    res.status(201).json({ message: "Bus request submitted", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// USER: Get my bus requests/submissions
// -------------------------
const getMyBuses = async (req, res) => {
  try {
    const userBuses = await BusRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    res.json(userBuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// USER: Update bus (for resubmission)
// -------------------------
const updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { busName, busNumber, busType, capacity, fare, amenities, stoppages } = req.body;

    const busRequest = await BusRequest.findOne({ 
      _id: busId, 
      userId: req.user.id // ensure user owns this bus request
    });

    if (!busRequest) {
      return res.status(404).json({ error: "Bus request not found or unauthorized" });
    }

    // Check if bus number already exists (excluding current request)
    const existingBus = await Bus.findOne({ busNumber });
    const existingRequest = await BusRequest.findOne({ 
      busNumber, 
      _id: { $ne: busId },
      status: { $ne: "rejected" }
    });

    if (existingBus || existingRequest) {
      return res.status(400).json({ error: "Bus number already exists" });
    }

    // Update the bus request
    busRequest.busName = busName;
    busRequest.busNumber = busNumber;
    busRequest.busType = busType;
    busRequest.capacity = capacity;
    busRequest.fare = fare;
    busRequest.amenities = amenities;
    busRequest.stoppages = stoppages;
    busRequest.status = "pending"; // reset to pending for re-review
    busRequest.rejectionReason = undefined; // clear any previous rejection reason

    await busRequest.save();

    res.json({ 
      success: true, 
      message: "Bus updated and resubmitted for approval",
      bus: busRequest
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// USER: Get specific bus details
// -------------------------
const getBusDetails = async (req, res) => {
  try {
    const { busId } = req.params;

    const busRequest = await BusRequest.findOne({ 
      _id: busId, 
      userId: req.user.id // ensure user owns this bus request
    });

    if (!busRequest) {
      return res.status(404).json({ error: "Bus request not found or unauthorized" });
    }

    res.json({ bus: busRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// ADMIN: Get all bus requests
// -------------------------
const getAllBusRequests = async (req, res) => {
  try {
    const requests = await BusRequest.find({ status: "pending" });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// ADMIN: Approve or Reject bus requests
// -------------------------
const approveBusRequest = async (req, res) => {
  try {
    const request = await BusRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const existingBus = await Bus.findOne({ busNumber: request.busNumber });
    if (existingBus) {
      return res.status(400).json({ error: "Bus number already exists" });
    }

    const newBus = new Bus({
      busName: request.busName,
      busNumber: request.busNumber,
      stoppages: request.stoppages,
      owner: request.userId // track the owner
    });

    await newBus.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "Bus approved and added to main DB", bus: newBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rejectBusRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body; // optional rejection reason
    const request = await BusRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = "rejected";
    if (rejectionReason) {
      request.rejectionReason = rejectionReason;
    }
    await request.save();

    res.json({ message: "Bus request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// Existing search / admin APIs
// -------------------------
const searchBus = async (req, res) => {
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();

  try {
    const buses = await Bus.find({ "stoppages.name": { $all: [from, to] } });

    const filteredBuses = buses
      .map(bus => {
        const stops = bus.stoppages.map(s => s.name.toLowerCase());
        const fromIndex = stops.indexOf(from);
        const toIndex = stops.indexOf(to);

        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return null;

        const direction = fromIndex < toIndex ? "going" : "return";
        const fromTime = direction === "going"
          ? bus.stoppages[fromIndex].goingTime
          : bus.stoppages[fromIndex].returnTime;

        const toTime = direction === "going"
          ? bus.stoppages[toIndex].goingTime
          : bus.stoppages[toIndex].returnTime;

        return {
          busName: bus.busName,
          busNumber: bus.busNumber,
          direction,
          from: { name: from, time: fromTime },
          to: { name: to, time: toTime },
          fullStoppages: bus.stoppages,
        };
      })
      .filter(Boolean);

    if (filteredBuses.length === 0) {
      return res.status(404).json({ message: "No buses found on this route." });
    }

    res.json(filteredBuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const buses = await Bus.find();
    const uniqueRoutes = new Set();

    buses.forEach(bus => {
      const route = bus.stoppages.map(stop => stop.name.toLowerCase()).join(" > ");
      uniqueRoutes.add(route);
    });

    res.json([...uniqueRoutes]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  requestBus,        // user requests bus
  getMyBuses,        // ✅ NEW: get user's bus requests
  updateBus,         // ✅ NEW: update bus for resubmission
  getBusDetails,     // ✅ NEW: get specific bus details
  getAllBusRequests, // admin gets pending requests
  approveBusRequest, // admin approves
  rejectBusRequest,  // admin rejects (now with reason)
  searchBus,
  getAllBuses,
  getAllRoutes
};