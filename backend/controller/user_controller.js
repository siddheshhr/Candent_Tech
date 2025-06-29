/**
 * User Controller
 * Handles user profile retrieval and update operations.
 */
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { errorHandler } = require("../utils/error");

/**
 * Get Current User
 * Retrieves the currently authenticated user's profile (excluding password).
 * Route: GET /api/users/me
 * Requires authentication middleware to set req.user.
 */
const getCurrentUser = async (req, res, next) => {
  try {
    console.log("Fetching user:", req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
};

/**
 * Update User Profile
 * Allows a user to update their own profile information.
 * Only the authenticated user can update their own account.
 * Password is hashed if provided.
 * Route: PUT /api/users/:userId
 * Requires authentication middleware to set req.user.
 */
const updateUser = async (req, res, next) => {
  try {
    console.log("Updating user:", req.params.userId, req.body);

    // Ensure user can only update their own profile
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You can only update your own account!"));
    }

    // Hash password if updating
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters!"));
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error);
  }
};

module.exports = { getCurrentUser, updateUser };
