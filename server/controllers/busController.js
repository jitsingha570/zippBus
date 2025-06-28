const Bus = require("../models/busModel");

// Add New Bus
const addBus = async (req, res) => {
  try {
    const { busName, busNumber, stoppages } = req.body;

    // Check if bus number already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ error: "Bus number already exists" });
    }

    const newBus = new Bus({ busName, busNumber, stoppages });
    await newBus.save();
    
    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Search Bus by route
const searchBus = async (req, res) => {
  const { from, to } = req.query;

  try {
    const buses = await Bus.find({
      "stoppages.name": { $all: [from, to] }
    });

    const filteredBuses = buses.filter(bus => {
      const stopNames = bus.stoppages.map(s => s.name);
      return stopNames.indexOf(from) < stopNames.indexOf(to);
    });

    if (filteredBuses.length === 0) {
      return res.status(404).json({ message: "No buses found on this route." });
    }

    res.json(filteredBuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { addBus, searchBus };
