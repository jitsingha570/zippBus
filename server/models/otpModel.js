const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // hashed password
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});


module.exports = mongoose.model("OTP", otpSchema);
