// server/models/busRequestModel.js
const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goingTime: { type: String, required: true },
  returnTime: { type: String, required: true },
});

const busRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who requested
    busName: { type: String, required: true },
    busNumber: { type: String, required: true }, // not unique, admin decides
    stoppages: {
      type: [stoppageSchema],
      validate: {
        validator: function (value) {
          return value.length >= 3 && value.length <= 10;
        },
        message: "Stoppages must be between 3 and 10.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusRequest", busRequestSchema);
