/**
 * User Routes
 * Defines API endpoints for user profile retrieval and update.
 * 
 * Routes:
 * - GET  /profile         : Get current authenticated user's profile (requires authentication)
 * - PUT  /update/:userId  : Update user profile by userId (requires authentication)
 */

const express = require("express");
const { updateUser} = require("../controller/user_controller");
const { verifyToken } = require("../utils/verifyUser");
const { getCurrentUser } = require('../controller/user_controller');

const router = express.Router();

// Middleware to log requests
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Routes
router.get("/profile", verifyToken, getCurrentUser);
router.put("/update/:userId", verifyToken, updateUser);

module.exports = router;
