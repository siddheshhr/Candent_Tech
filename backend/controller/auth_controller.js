const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var nodemailer = require("nodemailer");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields required !" });
  }
  const hashedPassword = await bcryptjs.hashSync(password, 12);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("signup success!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ message: "All fields required !" });
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ message: "Not a valid User !" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid User" });
    }
    //saving the encrypted value in cookie of browser
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const google = async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res) => {
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
    const link = `http://localhost:3000/auth/reset-password/${oldUser._id}/${token}`; // Change this while hosting
    console.log(link);

 //LEFT WITH SETTING GMAIL SERVICE CONNECTION

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sid4042.raskar@gmail.com",
        pass: "kxrn jqoy dsiy sgzv",
      },
    });

    var mailOptions = {
      from: "sid4042.raskar@gmail.com",
      to: "sid4042.raskar@gmail.com",
      subject: "Rest Password - Candent",
      text: link,
    };
// 
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;

  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);

    // Render a form for the user to enter a new password (frontend)
    res
      .status(200)
      .json({ message: "Token verified. Please enter a new password." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);

    // Hash the new password
    const encryptedPassword = await bcryptjs.hash(password, 12);

    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(400).json({ message: "Invalid or expired token." });
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
