const Bus = require("../models/busModel");
const User = require("../models/userModel");
const BusRequest = require("../models/busRequestModel");
const SearchStats = require("../models/SearchStats");

// ======================================
// 1️⃣ TOTAL SEARCH COUNT
// ======================================
const getSearchCount = async (req, res) => {
  try {
    const stats = await SearchStats.findOne({});

    res.status(200).json({
      success: true,
      totalSearches: stats?.totalSearches || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================================
// 2️⃣ TOTAL APPROVED BUS COUNT
// ======================================
const getBusCount = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();

    res.status(200).json({
      success: true,
      totalBuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================================
// 3️⃣ TOTAL USER COUNT
// ======================================
const getUserCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================================
// 4️⃣ TOTAL PENDING BUS REQUESTS (ADMIN)
// ======================================
const getPendingBusCount = async (req, res) => {
  try {
    const pendingCount = await BusRequest.countDocuments({
      status: "pending"
    });

    res.status(200).json({
      success: true,
      totalPendingBuses: pendingCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getSearchCount,
  getBusCount,
  getUserCount,
  getPendingBusCount
};
