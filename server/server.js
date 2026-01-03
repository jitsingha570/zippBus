// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// ✅ Routes
const busRoutes = require("./routes/busRoutes");
const userAuthRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const reportRoutes = require("./routes/reportRoutes");
const countsRoutes = require("./routes/countsRoutes");
const busEditRoute = require("./routes/busEditRoute");


app.use("/api/buses", busRoutes);  // 🚌 Bus-related endpoints
app.use("/api/users", userAuthRoutes);   // 👤 User login/register
app.use("/api/admins", adminAuthRoutes); // 🛠️ Admin login/register
app.use("/api/reports", reportRoutes);  // 📝 Report endpoints
app.use("/api/counts", countsRoutes);  // 📊 Counts endpoints
app.use("/api/bus-edit", busEditRoute); // 🚌 Bus editing endpoints
// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ 404 Error Handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler (optional but useful)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
