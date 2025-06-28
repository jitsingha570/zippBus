const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true }
});

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  stoppages: {
    type: [stoppageSchema],
    validate: {
      validator: function (value) {
        return value.length >= 3 && value.length <= 10;
      },
      message: "Stoppages must be between 3 and 10."
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
