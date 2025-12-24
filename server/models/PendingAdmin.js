// models/PendingAdmin.js
const mongoose = require("mongoose");

const pendingAdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userOtp: String,
  ownerOtp: String,
  expiresAt: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000 // 10 minutes
  }
});

module.exports = mongoose.model("PendingAdmin", pendingAdminSchema);
