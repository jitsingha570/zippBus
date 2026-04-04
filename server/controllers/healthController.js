const mongoose = require("mongoose");

const connectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const databaseStatus = connectionStates[dbState] || "unknown";
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: databaseStatus,
    },
  });
};

module.exports = { getHealthStatus };
