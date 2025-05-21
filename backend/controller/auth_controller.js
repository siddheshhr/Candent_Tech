// Authentication Controller for User Signup, Signin, Google OAuth, and Password Reset

const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { errorHandler } = require("../utils/error");

/**
 * User Signup Controller
 * Registers a new user with required fields. Hashes password and saves user to the database.
 */
const signup = async (req, res, next) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  if (!firstName || !lastName || !phoneNumber || !email || !password) {
    return next(errorHandler(400, "All fields are required!"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Auto-assign username as email since we don't need a separate username field.
  const newUser = new User({
    username: email, // Use email as the username
    firstName,
    lastName,
    phoneNumber, // Use phoneNumber field here
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "Signup success!" });
  } catch (error) {
    next(error);
  }
};

/**
 * User Signin Controller
 * Authenticates user credentials and returns JWT token.
 */
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "All fields required!" });
  }
  
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ message: "Not a valid User!" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid User" });
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.role === "admin" },
      process.env.JWT_SECRET
    );
    
    const { password: pass, ...rest } = validUser._doc;
    
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth Controller
 * Handles Google sign-in/signup and user creation if not exists.
 */
const google = async (req, res, next) => {
  // Include phoneNumber in case it is provided via OAuth (optional)
  const { email, name, googlePhotoUrl, phoneNumber } = req.body;
  
  try {
    // Validate required fields
    if (!email || !name) {
      return next(
        errorHandler(400, "Email and name are required for Google authentication.")
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id, isAdmin: existingUser.role === "admin" },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = existingUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // Split the full name into parts
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || name;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Not Provided";

      // Generate a random password for the new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Use provided phoneNumber if available; otherwise set a default placeholder
      const phoneNumberValue = phoneNumber ? phoneNumber : "Not Provided";

      // Create a new user, auto-assigning username as the email
      const newUser = new User({
        username: email,
        firstName,
        lastName,
        phoneNumber: phoneNumberValue,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.role === "admin" },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password Controller
 * Sends a password reset link to the user's email.
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/auth/reset-password/${oldUser._id}/${token}`;
    console.log("Reset link:", link);

    // Set up Nodemailer with Gmail
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // your Gmail address from .env
        pass: process.env.EMAIL_PASSWORD, // your Gmail app password from .env
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: oldUser.email,
      subject: "Reset Password - Candent",
      text: `Please use the following link to reset your password:\n\n${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email." });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "Password reset link sent to your email.",
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset Password Token Verification Controller
 * Verifies the password reset token.
 */
const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    jwt.verify(token, secret);

    res
      .status(200)
      .json({ message: "Token verified. Please enter a new password." });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Password Controller
 * Updates the user's password after verifying the reset token.
 */
const updatePassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    jwt.verify(token, secret);

    // Hash the new password
    const encryptedPassword = bcryptjs.hashSync(password, 12);
    await User.updateOne({ _id: id }, { $set: { password: encryptedPassword } });

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Export all authentication controllers
module.exports = {
  signup,
  signin,
  google,
  forgotPassword,
  resetPassword,
  updatePassword,
};
