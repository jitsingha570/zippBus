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
  order: {
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
// Bus Request Schema
// ======================
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

    // ✅ OPTIONAL CONTACT NUMBERS
    contactNumber1: {
      type: String,
      trim: true,
      match: [/^(\+91)?[6-9]\d{9}$/, "Invalid contact number 1"]
    },

    contactNumber2: {
      type: String,
      trim: true,
      match: [/^(\+91)?[6-9]\d{9}$/, "Invalid contact number 2"]
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

// Index for faster search by stop name
busRequestSchema.index({ "stoppages.name": 1 });

module.exports = mongoose.model("BusRequest", busRequestSchema);
