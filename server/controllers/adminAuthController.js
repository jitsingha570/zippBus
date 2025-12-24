const Admin = require("../models/Admin");
const PendingAdmin = require("../models/PendingAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// STEP 1 — Request Admin Registration
exports.requestAdminRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Remove previous pending registration
    await PendingAdmin.deleteMany({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTPs
    const userOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const ownerOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save pending admin in DB
    const pending = new PendingAdmin({
      name,
      email,
      password: hashedPassword,
      userOtp,
      ownerOtp
    });

    await pending.save();

    // Send OTP to user
    await sendEmail(email, "Your Admin Verification OTP", `Your OTP is: ${userOtp}`);

    // Send OTP to super admin email
    await sendEmail(
      process.env.SUPER_ADMIN_EMAIL,
      "New Admin Registration Approval",
      `User Email: ${email}\nApproval OTP: ${ownerOtp}`
    );

    res.json({
      message: "OTP sent to user & super admin. Complete verification to register."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// STEP 2 — Verify OTPs and finalize registration
exports.verifyAdminOTPs = async (req, res) => {
  try {
    const { email, userOtp, ownerOtp } = req.body;

    const record = await PendingAdmin.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "Verification record not found or expired" });
    }

    if (record.userOtp !== userOtp) {
      return res.status(400).json({ message: "Invalid user OTP" });
    }

    if (record.ownerOtp !== ownerOtp) {
      return res.status(400).json({ message: "Invalid approval OTP" });
    }

    // Create admin in final collection
    const newAdmin = new Admin({
      name: record.name,
      email: record.email,
      password: record.password,
      role: "admin"
    });

    await newAdmin.save();
    await PendingAdmin.deleteOne({ email });

    res.json({ message: "Admin successfully registered" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
