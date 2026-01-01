const mongoose = require("mongoose");

const searchStatsSchema = new mongoose.Schema(
  {
    totalSearches: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchStats", searchStatsSchema);
