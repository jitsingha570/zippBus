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
// Bus Schema
// ======================
const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },

  busNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // ✅ OPTIONAL CONTACT NUMBERS (BLANK ALLOWED)
  contactNumber1: {
    type: String,
    trim: true,
    default: "",
    validate: {
      validator: function (v) {
        if (!v) return true; // ✅ allow empty string
        return /^(\+91)?[6-9]\d{9}$/.test(v);
      },
      message: "Invalid contact number 1"
    }
  },

  contactNumber2: {
    type: String,
    trim: true,
    default: "",
    validate: {
      validator: function (v) {
        if (!v) return true; // ✅ allow empty string
        return /^(\+91)?[6-9]\d{9}$/.test(v);
      },
      message: "Invalid contact number 2"
    }
  },

  busType: {
    type: String,
    required: true,
    enum: [
      'AC Seater',
      'Non-AC Seater',
      'Sleeper AC',
      'Sleeper Non-AC',
      'Volvo',
      'Luxury'
    ],
    default: 'Non-AC Seater'
  },

  capacity: {
    type: Number,
    required: true,
    min: 20,
    max: 60,
    default: 40
  },

  fare: {
    type: Number,
    required: true,
    min: 50,
    default: 100
  },

  amenities: [{
    type: String,
    enum: [
      'WiFi',
      'Charging Points',
      'Entertainment',
      'Blankets',
      'Snacks',
      'Water Bottle',
      'GPS Tracking',
      'CCTV'
    ]
  }],

  stoppages: {
    type: [stoppageSchema],
    validate: {
      validator: function (value) {
        return value.length >= 3 && value.length <= 10;
      },
      message: "Stoppages must be between 3 and 10."
    }
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

// Index for faster search
busSchema.index({ "stoppages.name": 1 });

module.exports = mongoose.model("Bus", busSchema);
