const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    role: {
      type: String,
      enum: ["admin", "hr", "client"], // Role-based access
      default: "client",
    },
    // resetLink: {
    //   type: String,
    //   default: ''
    // }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
