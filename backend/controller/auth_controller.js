const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { errorHandler } = require("../utils/error");

const signup = async (req, res, next) => {
  
  const { firstName, lastName, dateOfBirth, email, password } = req.body;

  if (!firstName || !lastName || !dateOfBirth || !email || !password) {
    return next(errorHandler(400, "All fields are required!"));
  }
  
  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Auto-assign username as email since we don't need a separate username field.
  const newUser = new User({
    username: email,  // Use email as the username
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
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

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.role === "admin" },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ")[1] || "",
        dateOfBirth: new Date(), // or ask for DOB later
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.role === "admin" },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

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

module.exports = {
  signup,
  signin,
  google,
  forgotPassword,
  resetPassword,
  updatePassword,
};
