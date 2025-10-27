const User = require('../models/userModel');
const Bus = require('../models/busModel'); // Add this import
const Report = require('../models/reportModel'); // Add this import (you'll need to create this model)
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

require('dotenv').config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY_MINUTES = 5;

// 📩 REGISTER (Send OTP only)
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Step 1: Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Step 3: Generate OTP and hash password
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Remove any old OTP entries for this email
    await OTP.deleteMany({ email });

    // Step 5: Save new OTP record
    await OTP.create({
      email,
      otp,
      name,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Step 6: Send OTP email
    try {
      await sendEmail(email, "ZippBus OTP Verification", `Your OTP is ${otp}`);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
      await OTP.deleteMany({ email }); // clean up
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please check your email address and try again.",
      });
    }

    // Step 7: Success
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error during registration",
    });
  }
};

// ✅ VERIFY OTP and CREATE USER
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Step 1: Validate input
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Step 2: Find OTP record
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Step 3: Optional - Check OTP expiry (10 min)
    const otpAge = (Date.now() - validOtp.createdAt.getTime()) / 1000 / 60; // in minutes
    if (otpAge > 10) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ success: false, message: "OTP has expired. Please register again." });
    }

    // Step 4: Create new verified user
    const newUser = new User({
      name: validOtp.name,
      email: validOtp.email,
      password: validOtp.password, // already hashed
      isVerified: true,
    });

    await newUser.save();
    await OTP.deleteMany({ email }); // clean up

    res.status(201).json({
      success: true,
      message: "User registered and verified successfully",
    });

  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

// 🔁 RESEND OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Step 1: Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    // Step 2: Check for pending OTP record
    const existingOtp = await OTP.findOne({ email });
    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    // Step 3: Generate new OTP and update record
    const otp = generateOTP();
    existingOtp.otp = otp;
    existingOtp.createdAt = new Date();
    await existingOtp.save();

    // Step 4: Send new OTP
    try {
      await sendEmail(email, "ZippBus Resend OTP", `Your new OTP is ${otp}`);
    } catch (emailErr) {
      console.error("❌ Resend Email failed:", emailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send new OTP. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (err) {
    console.error("❌ Resend OTP Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
    });
  }
};

// 🔐 LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("=== LOGIN DEBUG START ===");
  console.log("Request body:", { email, password: password ? "[PROVIDED]" : "[MISSING]" });

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
    }

    if (!user.password) {
      return res.status(500).json({ success: false, message: "Account setup incomplete" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // include role here
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for user:", user.email);
    console.log("=== LOGIN DEBUG END ===");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("💥 Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// 👤 GET USER PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✏️ UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Name must be at least 2 characters long" 
      });
    }

    // Optional phone validation
    if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid phone number" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        address: address ? address.trim() : null,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Server error while updating profile" 
    });
  }
};

// 📊 GET USER STATISTICS
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parallel queries for better performance
    const [
      totalBusesAdded,
      approvedBuses,
      pendingBuses,
      rejectedBuses,
      totalReports,
      recentReports
    ] = await Promise.all([
      // Total buses added by user
      Bus.countDocuments({ owner: userId }),
      
      // Approved buses
      Bus.countDocuments({ owner: userId, status: 'approved' }),
      
      // Pending buses
      Bus.countDocuments({ owner: userId, status: 'pending' }),
      
      // Rejected buses
      Bus.countDocuments({ owner: userId, status: 'rejected' }),
      
      // Total reports submitted (if Report model exists)
      Report ? Report.countDocuments({ reportedBy: userId }) : 0,
      
      // Recent reports in last 30 days
      Report ? Report.countDocuments({ 
        reportedBy: userId, 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }) : 0
    ]);

    // Calculate success rate
    const successRate = totalBusesAdded > 0 
      ? Math.round((approvedBuses / totalBusesAdded) * 100) 
      : 0;

    // Get user's bus types distribution
    const busTypeStats = await Bus.aggregate([
      { $match: { owner: userId } },
      { $group: { 
          _id: '$busType', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    // Get user's most active routes (top 3)
    const popularRoutes = await Bus.aggregate([
      { $match: { owner: userId, status: 'approved' } },
      { $project: { 
          route: { 
            $concat: [
              { $arrayElemAt: ['$stoppages.name', 0] }, 
              ' → ', 
              { $arrayElemAt: ['$stoppages.name', -1] }
            ] 
          } 
        } 
      },
      { $group: { 
          _id: '$route', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const stats = {
      // Bus-related stats
      totalBusesAdded,
      approvedBuses,
      pendingBuses,
      rejectedBuses,
      successRate,
      
      // Report-related stats
      totalReports,
      recentReports,
      
      // Calculated fields for frontend compatibility
      totalBookings: 0, // Placeholder - implement if you have booking system
      upcomingTrips: pendingBuses, // Using pending buses as upcoming
      totalSpent: 0, // Placeholder - implement if you track expenses
      
      // Additional insights
      busTypeDistribution: busTypeStats,
      favoriteRoutes: popularRoutes.map(route => route._id),
      
      // Performance metrics
      averageBusesPerMonth: totalBusesAdded > 0 ? 
        Math.round(totalBusesAdded / Math.max(1, getMonthsSinceRegistration(req.user.createdAt))) : 0,
      
      // Status summary for dashboard
      statusSummary: {
        approved: approvedBuses,
        pending: pendingBuses,
        rejected: rejectedBuses,
        total: totalBusesAdded
      }
    };

    res.json({ 
      success: true, 
      stats 
    });

  } catch (err) {
    console.error("Get User Stats Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching statistics" 
    });
  }
};

// Helper function to calculate months since registration
const getMonthsSinceRegistration = (createdAt) => {
  if (!createdAt) return 1;
  const now = new Date();
  const created = new Date(createdAt);
  const monthsDiff = (now.getFullYear() - created.getFullYear()) * 12 + 
                     (now.getMonth() - created.getMonth());
  return Math.max(1, monthsDiff);
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  updateProfile,    // 🆕 New function
  getUserStats      // 🆕 New function
};