const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    confirmPassword: {
      type: String,
      required: [true, "confirmPassword is required"],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isVerified: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const RegisteredUser = mongoose.model("RegisteredUser", userSchema);

module.exports = RegisteredUser;
