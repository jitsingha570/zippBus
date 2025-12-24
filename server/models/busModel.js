const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goingTime: { type: String, required: true },
  returnTime: { type: String, required: true }
});

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  busType: {
    type: String,
    required: true,
    enum: ['AC Seater', 'Non-AC Seater', 'Sleeper AC', 'Sleeper Non-AC', 'Volvo', 'Luxury'],
    default: 'Non-AC Seater' // ✅ default changed
  },
  capacity: {
    type: Number,
    required: true,
    min: 20,
    max: 60,
    default: 40 // optional: set default capacity
  },
  fare: {
    type: Number,
    required: true,
    min: 50,
    default: 100 // optional: set default fare
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging Points', 'Entertainment', 'Blankets', 'Snacks', 'Water Bottle', 'GPS Tracking', 'CCTV']
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

module.exports = mongoose.model("Bus", busSchema);
