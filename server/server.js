// server.js

const express = require("express"); //import express module from node module to create api 
const mongoose = require("mongoose"); // import mongoose module to connect to mongodb database
const dotenv = require("dotenv"); //import dotenv module to manage environment variables
const cors = require("cors"); //import cors module to handle cross-origin requests to allow frontend to access backend api
const path = require("path"); //import path module to work with file and directory paths to safely handle file paths across different operating systems

// ✅ Load environment variables
//.config() method loads environment variables from a .env file into process.env
//path.resolve(__dirname, ".env") constructs an absolute path to the .env file located in the same directory as server.js
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ✅ Initialize Express app
//creates an instance of an Express application , app is an object that represent the entire web application
const app = express();

// ✅ Middleware
//.use() method mounts the specified middleware function(s) at the specified path.... is a security check that allows or restricts resources on a web server depending on where the HTTP request was initiated
app.use(cors()); // Enable CORS for all routes , every incoming request will first pass through the CORS middleware to handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies , every incoming request with a Content-Type of application/json will be parsed and made available on req.body

// ✅ Routes 
//import route handlers for different API endpoints
const busRoutes = require("./routes/busRoutes");
const userAuthRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const reportRoutes = require("./routes/reportRoutes");
const countsRoutes = require("./routes/countsRoutes");
const busEditRoute = require("./routes/busEditRoute");
const uniqueRoutes = require("./routes/uniqueRoutes");



//mount the imported route handlers on specific paths , add one more security layer by organizing the API endpoints
app.use("/api/buses", busRoutes);  // 🚌 Bus-related endpoints
app.use("/api/users", userAuthRoutes);   // 👤 User login/register
app.use("/api/admins", adminAuthRoutes); // 🛠️ Admin login/register
app.use("/api/reports", reportRoutes);  // 📝 Report endpoints
app.use("/api/counts", countsRoutes);  // 📊 Counts endpoints
app.use("/api/bus-edit", busEditRoute); // 🚌 Bus editing endpoints
app.use("/api/bus-routes", uniqueRoutes); // 🚍 Unique routes endpoint


// ✅ MongoDB Connection
//process.env is a global object that provides access to environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1); // Exit the application with an error code 1 is a general error code indicating that something went wrong
  //error code 0 indicates successful completion
  // error code more than 1 indicates that an error occurred during execution 
}
  

//.connect() method establishes a connection to the MongoDB database using the provided URI and returns a promise 
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,  //modern URL string parser to handle special characters in connection strings
    useUnifiedTopology: true, //uses the new Server Discover and Monitoring engine to improve server selection and monitoring
  })
  .then(() => console.log("✅ MongoDB connected"))  // connection successful return an arrow function that logs a success message to the console
  
  //if connection fails return an arrow function that logs an error message to the console
  .catch((err) => {    
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ 404 Error Handling for undefined routes
//this middleware will be executed if no other route matches the incoming request and this req , res , next are the standard parameters for Express middleware functions req denotes the incoming request object res denotes the response object that will be sent back to the client and next is a function that passes control to the next middleware function in the stack
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });  // error 404 meaing the requested resource could not be found on the server  
});

// ✅ Global Error Handler (optional but useful)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);  // err.stack provides a stack trace of the error for debugging purposes
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//listen() method starts the server and listens for incoming requests on the specified port