const mongoose = require("mongoose"); // <-- ADD THIS
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

    res.status(200).json({
      success: true,
      payload: requests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// -------------------------
// ADMIN: Approve or Reject bus requests
// -------------------------
const approveBusRequest = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid bus request ID" });
    }

    const request = await BusRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Bus request not found" });

    const existingBus = await Bus.findOne({ busNumber: request.busNumber });
    if (existingBus) return res.status(400).json({ error: "Bus number already exists" });

    // ✅ Match enum values exactly
    const validBusTypes = ['AC Seater', 'Non-AC Seater', 'Sleeper AC', 'Sleeper Non-AC', 'Volvo', 'Luxury'];
    const busType = validBusTypes.includes(request.busType) ? request.busType : 'Non-AC Seater'; // default

    const capacity = request.capacity >= 20 ? request.capacity : 40; // default 40
    const fare = request.fare >= 50 ? request.fare : 100;            // default 100

    const newBus = new Bus({
      busName: request.busName,
      busNumber: request.busNumber,
      stoppages: Array.isArray(request.stoppages) ? request.stoppages : [],
      owner: request.userId,
      busType,
      capacity,
      fare,
      amenities: Array.isArray(request.amenities) ? request.amenities : []
    });

    await newBus.save();

    request.status = "approved";
    await request.save();

    res.json({ success: true, message: "Bus approved and added to main DB", bus: newBus });
  } catch (err) {
    console.error("Approve Bus Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};


const rejectBusRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { rejectionReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid bus request ID" });
    }

    const request = await BusRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Bus request not found" });
    }

    request.status = "rejected";
    if (rejectionReason) request.rejectionReason = rejectionReason;
    await request.save();

    res.json({ success: true, message: "Bus request rejected", request });
  } catch (err) {
    console.error("Reject Bus Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// -------------------------
// Existing search / admin APIs
// -------------------------
const searchBus = async (req, res) => {
  try {
    let { from, to } = req.query;

    // 1️⃣ Validate query params
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' locations are required"
      });
    }

    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    // 2️⃣ Fetch all buses
    const buses = await Bus.find({}).lean();

    if (!buses.length) {
      return res.json({
        success: true,
        count: 0,
        buses: [],
        message: "No buses available in database"
      });
    }

    const matchedBuses = [];

    // 3️⃣ Process each bus
    for (const bus of buses) {
      if (!bus.stoppages || bus.stoppages.length < 2) continue;

      // Normalize stoppage names
      const stoppageNames = bus.stoppages.map(s =>
        s.name.trim().toLowerCase()
      );

      // 4️⃣ Partial + case-insensitive match
      const fromIndex = stoppageNames.findIndex(name =>
        name.includes(from)
      );
      const toIndex = stoppageNames.findIndex(name =>
        name.includes(to)
      );

      // 5️⃣ Validate order
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        matchedBuses.push({
          _id: bus._id,
          busName: bus.busName,
          busNumber: bus.busNumber,
          busType: bus.busType,
          fare: bus.fare,
          capacity: bus.capacity,
          amenities: bus.amenities,
          fromStop: bus.stoppages[fromIndex],
          toStop: bus.stoppages[toIndex]
        });
      }
    }

    // 6️⃣ Final response
    res.json({
      success: true,
      count: matchedBuses.length,
      buses: matchedBuses
    });

  } catch (error) {
    console.error("Search Bus Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
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