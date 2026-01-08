/*const mongoose = require("mongoose"); // <-- ADD THIS
const Bus = require("../models/busModel");
const BusRequest = require("../models/busRequestModel"); // ✅ new schema
const BusUpdateRequest = require("../models/busUpdateRequestModel");

// -------------------------
// USER: Request to add a bus
// -------------------------
const requestBus = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      busName,
      busNumber,
      busType,
      capacity,
      fare,
      amenities,
      stoppages
    } = req.body;
       if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
      }
    const newRequest = new BusRequest({
      userId: req.user.id,
      busName,
      busNumber,
      busType,
      capacity,
      fare,
      amenities,
      stoppages
    });

    await newRequest.save();
    res.status(201).json(newRequest);

  } catch (error) {
    console.error("BACKEND ERROR 👉", error);
    res.status(500).json({ error: error.message });
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
    const { busNumber } = req.params;
    const {
      busName,
      busType,
      capacity,
      fare,
      amenities,
      stoppages
    } = req.body;

    // 1️⃣ Find bus request by unique busNumber + user ownership
    const busRequest = await BusRequest.findOne({
      busNumber,
      userId: req.user.id
    });

    if (!busRequest) {
      return res.status(404).json({
        error: "Bus request not found or unauthorized"
      });
    }

    // 2️⃣ Update only provided fields (safe partial update)
    if (busName !== undefined) busRequest.busName = busName;
    if (busType !== undefined) busRequest.busType = busType;
    if (capacity !== undefined) busRequest.capacity = capacity;
    if (fare !== undefined) busRequest.fare = fare;
    if (amenities !== undefined) busRequest.amenities = amenities;
    if (stoppages !== undefined) busRequest.stoppages = stoppages;

    // 3️⃣ Reset approval status
    busRequest.status = "pending";
    busRequest.rejectionReason = "";

    await busRequest.save();

    res.status(200).json({
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
    const { id } = req.params;

    // 1️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid bus request ID" });
    }

    // 2️⃣ Find request
    const request = await BusRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Bus request not found" });
    }

    // 3️⃣ Prevent double approval
    if (request.status === "approved") {
      return res.status(400).json({ error: "Bus already approved" });
    }

    // 4️⃣ Check duplicate bus number
    const existingBus = await Bus.findOne({ busNumber: request.busNumber });
    if (existingBus) {
      return res.status(400).json({ error: "Bus number already exists" });
    }

    // 5️⃣ Validate owner
    if (!request.userId) {
      return res.status(400).json({ error: "Request has no userId (owner missing)" });
    }

    // 6️⃣ Bus Type mapping (VERY IMPORTANT)
    const validBusTypes = [
      "AC Seater",
      "Non-AC Seater",
      "Sleeper AC",
      "Sleeper Non-AC",
      "Volvo",
      "Luxury",
    ];

    let busType = "Non-AC Seater";
    if (validBusTypes.includes(request.busType)) {
      busType = request.busType;
    }

    // 7️⃣ Safe defaults
    const capacity =
      typeof request.capacity === "number" && request.capacity >= 20
        ? request.capacity
        : 40;

    const fare =
      typeof request.fare === "number" && request.fare >= 50
        ? request.fare
        : 100;

    const stoppages =
      Array.isArray(request.stoppages) && request.stoppages.length >= 3
        ? request.stoppages
        : [];

    // 8️⃣ Create main Bus
    const newBus = new Bus({
      busName: request.busName,
      busNumber: request.busNumber,
      busType,
      capacity,
      fare,
      amenities: Array.isArray(request.amenities) ? request.amenities : [],
      stoppages,
      owner: request.userId,
    });

    await newBus.save();

    // 9️⃣ Update request status
    request.status = "approved";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Bus approved successfully",
      bus: newBus,
    });

  } catch (err) {
    console.error("Approve Bus Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

const rejectBusRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid bus request ID" });
    }

    // 2️⃣ Find request
    const request = await BusRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Bus request not found" });
    }

    // 3️⃣ Prevent re-rejection
    if (request.status === "rejected") {
      return res.status(400).json({ error: "Bus request is already rejected" });
    }

    // 4️⃣ Prevent approving a rejected request
    if (request.status === "approved") {
      return res.status(400).json({ error: "Bus request already approved, cannot reject" });
    }

    // 5️⃣ Set status and optional rejection reason
    request.status = "rejected";
    request.rejectionReason = rejectionReason ? rejectionReason : "No reason provided";

    // 6️⃣ Save changes
    await request.save();

    // 7️⃣ Respond
    return res.status(200).json({
      success: true,
      message: "Bus request rejected successfully",
      request,
    });

  } catch (err) {
    console.error("Reject Bus Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
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
//-------------------------
//admin can : approve/reject bus  update requests
//-------------------------


module.exports = {
  requestBus,        // user requests to add new bus
  getMyBuses,        // ✅ NEW: get user's bus requests
  updateBus,         // ✅ NEW: update bus for resubmission by user and insert stopage in existing bus route
  getBusDetails,     // ✅ NEW: get specific bus details (bus number)
  getAllBusRequests, // admin gets pending requests
  approveBusRequest, // admin approves
  rejectBusRequest,  // admin rejects (now with reason)
  searchBus,   // search buses by from/to stoppages
  getAllBuses,  // get all buses (admin)
  getAllRoutes  // get all unique routes (admin)
};*/




const mongoose = require("mongoose");
const Bus = require("../models/busModel");
const BusRequest = require("../models/busRequestModel");
const BusUpdateRequest = require("../models/BusEditRequestModel");
const SearchStats = require("../models/SearchStats");
// -------------------------
// USER: Request to add a bus
// -------------------------
const requestBus = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { busName, busNumber, busType, capacity, fare, amenities, stoppages } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ===============================
    // Validate stoppages
    // ===============================
    if (!Array.isArray(stoppages) || stoppages.length < 3) {
      return res.status(400).json({
        error: "At least 3 stoppages with order are required"
      });
    }

    // ===============================
    // Normalize bus number
    // ===============================
    const normalizeBusNumber = (number) =>
      number.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const normalizedBusNumber = normalizeBusNumber(busNumber);

    // ===============================
    // ✅ CHECK DUPLICATE ONLY IN MAIN BUS COLLECTION
    // ===============================
    const existingBus = await Bus.findOne({
      busNumber: normalizedBusNumber
    });

    if (existingBus) {
      return res.status(409).json({
        error: "Bus with this number already exists"
      });
    }

    // ===============================
    // Create new request
    // ===============================
    const newRequest = new BusRequest({
      userId: req.user.id,
      busName,
      busNumber: normalizedBusNumber, // normalized for uniqueness
      displayNumber: busNumber,       // original for UI
      busType,
      capacity,
      fare,
      amenities,
      stoppages
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Bus request submitted successfully",
      data: newRequest
    });

  } catch (error) {
    console.error("BACKEND ERROR 👉", error);
    res.status(500).json({ error: error.message });
  }
};




// -------------------------
// USER: Get my bus requests
// -------------------------
const getMyBuses = async (req, res) => {
  try {
    const userBuses = await BusRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(userBuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// USER: Update bus request (resubmission)
// -------------------------
const updateBus = async (req, res) => {
  try {
    const { busNumber } = req.params;
    const { busName, busType, capacity, fare, amenities, stoppages, insertStoppage } = req.body;

    // Normalize bus number for consistency
    const normalizeBusNumber = (number) => number.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const normalizedBusNumber = normalizeBusNumber(busNumber);

    // Find bus by normalized number
    const busRequest = await BusRequest.findOne({ busNumber: normalizedBusNumber, userId: req.user.id });
    if (!busRequest) return res.status(404).json({ error: "Bus request not found or unauthorized" });

    // Partial update logic
    if (busName !== undefined) busRequest.busName = busName;
    if (busType !== undefined) busRequest.busType = busType;
    if (capacity !== undefined) busRequest.capacity = capacity;
    if (fare !== undefined) busRequest.fare = fare;
    if (amenities !== undefined) busRequest.amenities = amenities;

    // Handle stoppages
    if (stoppages) {
      busRequest.stoppages = stoppages; // Replace entire stoppages array
    }

    // Insert a new stoppage in the middle (optional)
    if (insertStoppage) {
      const { order, name } = insertStoppage; // e.g., { order: 2, name: "New Stop" }
      if (order < 1 || order > busRequest.stoppages.length + 1) {
        return res.status(400).json({ error: "Invalid stoppage order" });
      }
      // Insert at correct position (order - 1 because arrays are 0-indexed)
      busRequest.stoppages.splice(order - 1, 0, name);
    }

    // Reset approval status
    busRequest.status = "pending";
    busRequest.rejectionReason = "";

    await busRequest.save();

    res.status(200).json({
      success: true,
      message: "Bus updated and resubmitted for approval",
      bus: busRequest
    });

  } catch (err) {
    console.error("UPDATE BUS ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
};


// -------------------------
// USER: Get specific bus request
// -------------------------
const getBusDetails = async (req, res) => {
  try {
    const { busNumber } = req.params;

    if (!busNumber) {
      return res.status(400).json({ error: "Bus number is required" });
    }

    const normalized = busNumber.replace(/[\s-]/g, "").toUpperCase();

    const bus = await Bus.findOne({
      normalizedBusNumber: normalized
    });

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    res.json({ bus });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// -------------------------
// ADMIN: Get all pending bus requests
// -------------------------
const getAllBusRequests = async (req, res) => {
  try {
    const requests = await BusRequest.find({ status: "pending" });
    res.status(200).json({ success: true, payload: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// ADMIN: Approve bus request
// -------------------------
const approveBusRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid bus request ID" });

    const request = await BusRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Bus request not found" });
    if (request.status === "approved") return res.status(400).json({ error: "Bus already approved" });

    const existingBus = await Bus.findOne({ busNumber: request.busNumber });
    if (existingBus) return res.status(400).json({ error: "Bus number already exists" });

    const newBus = new Bus({
      busName: request.busName,
      busNumber: request.busNumber,
      busType: request.busType || "Non-AC Seater",
      capacity: request.capacity >= 20 ? request.capacity : 40,
      fare: request.fare >= 50 ? request.fare : 100,
      amenities: Array.isArray(request.amenities) ? request.amenities : [],
      stoppages: request.stoppages,
      owner: request.userId
    });

    await newBus.save();
    request.status = "approved";
    await request.save();

    res.status(200).json({ success: true, message: "Bus approved successfully", bus: newBus });

  } catch (err) {
    console.error("Approve Bus Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// -------------------------
// ADMIN: Reject bus request
// -------------------------
const rejectBusRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid bus request ID" });

    const request = await BusRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Bus request not found" });
    if (request.status === "rejected") return res.status(400).json({ error: "Already rejected" });
    if (request.status === "approved") return res.status(400).json({ error: "Already approved, cannot reject" });

    request.status = "rejected";
    request.rejectionReason = rejectionReason || "No reason provided";
    await request.save();

    res.status(200).json({ success: true, message: "Bus request rejected successfully", request });

  } catch (err) {
    console.error("Reject Bus Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// -------------------------
// SEARCH BUS (From → To using order)
// -------------------------
const searchBus = async (req, res) => {
  try {
    let { from, to } = req.query;

    // ===============================
    // 1. Validation
    // ===============================
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' are required"
      });
    }

    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    // ===============================
    // 2. 🔥 INCREMENT SEARCH COUNT
    // ===============================
    await SearchStats.findOneAndUpdate(
      {}, // single global document
      {
        $inc: {
          totalSearches: 1,
          [`routeSearches.${from}_${to}`]: 1
        }
      },
      { upsert: true, new: true }
    );
    // ===============================
    // 2. Fetch all buses
    // ===============================
    const buses = await Bus.find({}).lean();
    const matchedBuses = [];

    // ===============================
    // 3. Process each bus
    // ===============================
    for (const bus of buses) {
      if (!bus.stoppages || bus.stoppages.length < 2) continue;

      const fromStop = bus.stoppages.find(
        s => s.name.toLowerCase() === from
      );

      const toStop = bus.stoppages.find(
        s => s.name.toLowerCase() === to
      );

      if (!fromStop || !toStop) continue;

      let routeStoppages = [];
      let direction = "";

      // ===============================
      // 4. NORMAL DIRECTION (GOING)
      // ===============================
      if (fromStop.order < toStop.order) {
        direction = "GOING";

        routeStoppages = bus.stoppages
          .filter(s =>
            s.order >= fromStop.order &&
            s.order <= toStop.order
          )
          .sort((a, b) => a.order - b.order);
      }

      // ===============================
      // 5. REVERSE DIRECTION (RETURN)
      // ===============================
      else if (fromStop.order > toStop.order) {
        direction = "RETURN";

        routeStoppages = bus.stoppages
          .filter(s =>
            s.order <= fromStop.order &&
            s.order >= toStop.order
          )
          .sort((a, b) => b.order - a.order);
      }

      // If same stop
      else {
        continue;
      }

      // ===============================
      // 6. Map stoppages (both times)
      // ===============================
      const formattedStoppages = routeStoppages.map(s => ({
        name: s.name,
        order: s.order,
        goingTime: s.goingTime,
        returnTime: s.returnTime
      }));

      // ===============================
      // 7. Push matched bus
      // ===============================
      matchedBuses.push({
        _id: bus._id,
        busName: bus.busName,
        busNumber: bus.busNumber,
        busType: bus.busType,
        fare: bus.fare,
        capacity: bus.capacity,
        amenities: bus.amenities,
        direction, // 👈 GOING / RETURN
        route: {
          from,
          to,
          stoppages: formattedStoppages
        }
      });
    }

    // ===============================
    // 8. Response
    // ===============================
    res.status(200).json({
      success: true,
      count: matchedBuses.length,
      buses: matchedBuses
    });

  } catch (error) {
    console.error("Search Bus Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};






// -------------------------
// GET ALL BUSES (Admin)
// -------------------------
// Get all buses
const getAllBuses = async (req, res) => {
  try {
    // Fetch all buses sorted by creation date (latest first)
    const buses = await Bus.find()
      .populate("owner", "name email") // optional: include owner info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// -------------------------
// GET ALL UNIQUE ROUTES
// -------------------------
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


// -------------------------
// SEARCH BUS BY NAME OR NUMBER
// -------------------------
const searchBusByNameOrNumber = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Normalize search query
    const normalizedQuery = q
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, ""); // remove space, -, etc

    const buses = await Bus.find({
      $or: [
        // Search by bus name (normal text search)
        { busName: { $regex: q, $options: "i" } },

        // Search by raw bus number
        { busNumber: { $regex: q, $options: "i" } },

        // Search by normalized bus number
        {
          busNumber: {
            $regex: normalizedQuery,
            $options: "i",
          },
        },
      ],
    });

    res.json({
      success: true,
      count: buses.length,
      buses,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





module.exports = {
  requestBus,
  getMyBuses,
  updateBus,
  getBusDetails,
  getAllBusRequests,
  approveBusRequest,
  rejectBusRequest,
  searchBus,
  getAllBuses,
  getAllRoutes,
  searchBusByNameOrNumber,
  
};
