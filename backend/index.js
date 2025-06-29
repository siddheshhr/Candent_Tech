require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth_route.js");
const userRoutes = require("./routes/user_route.js");

const cookieParser = require("cookie-parser");
const leadRoutes = require("./routes/lead_routes.js");
const commentRoutes = require('./routes/comment_route.js');

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

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser()); 

// Mount authentication and user routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Mount lead and comment routes under /api
app.use("/api/leads", leadRoutes); 
app.use('/api/comments', commentRoutes);

// Test route to verify API is running
app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Global error handler middleware
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
