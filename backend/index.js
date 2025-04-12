require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const authRoutes = require("./routes/auth_route.js");
const userRoutes = require("./routes/user_route.js");
const cookieParser = require("cookie-parser");
// const cookieParser = require('cookie-parser');
// index.js (already in your code)
const leadRoutes = require("./routes/lead_routes.js");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

// Configure CORS to allow credentials and specify the frontend origin
const cors = require('cors');
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // for handling cookies
// app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/leads", leadRoutes); // Mounts the lead routes at /api/leads

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
