const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { errorHandler } = require("../utils/error");

const updateUser = async (req, res, next) => {
  console.log(req.user);
  try {
    // Ensure the logged-in user is updating their own account
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You can only update your own account!"));
    }

    // If updating the password, validate and hash it
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters!"));
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user document in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
    console.log(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser };
