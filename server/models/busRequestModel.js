// server/models/busRequestModel.js
const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goingTime: { type: String, required: true },
  returnTime: { type: String, required: true }
});

const busRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    busName: {
      type: String,
      required: true
    },

    busNumber: {
      type: String,
      required: true
    },

    // ✅ UPDATED ENUM (MATCHES Bus schema)
    busType: {
      type: String,
      enum: [
        "AC Seater",
        "Non-AC Seater",
        "Sleeper AC",
        "Sleeper Non-AC",
        "Volvo",
        "Luxury"
      ],
      default: "Non-AC Seater"
    },

    capacity: {
      type: Number,
      min: 20,
      max: 60,
      default: 40
    },

    fare: {
      type: Number,
      min: 50,
      default: 100
    },

    amenities: [
      {
        type: String,
        enum: [
          "WiFi",
          "Charging Points",
          "Entertainment",
          "Blankets",
          "Snacks",
          "Water Bottle",
          "GPS Tracking",
          "CCTV"
        ]
      }
    ],

    stoppages: {
      type: [stoppageSchema],
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 3 && value.length <= 10;
        },
        message: "Stoppages must be between 3 and 10."
      }
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    rejectionReason: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusRequest", busRequestSchema);
