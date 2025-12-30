const mongoose = require("mongoose");

// ======================
// Stoppage Schema
// ======================
const stoppageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  order: {                // New field added
    type: Number,
    required: true
  },
  goingTime: {
    type: String,
    required: true
  },
  returnTime: {
    type: String,
    required: true
  }
});

// ======================
// Bus Update Request Schema
// ======================
const busUpdateRequestSchema = new mongoose.Schema(
  {
    // 🔗 Reference to original bus
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },

    // 👤 Who requested the update
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🚌 Updated fields
    busName: {
      type: String,
      required: true
    },

    busNumber: {
      type: String,
      required: true
    },

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

    // 🛂 Approval workflow
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

// Optional index for faster search by stoppage name
busUpdateRequestSchema.index({ "stoppages.name": 1 });

module.exports = mongoose.model(
  "BusUpdateRequest",
  busUpdateRequestSchema
);
