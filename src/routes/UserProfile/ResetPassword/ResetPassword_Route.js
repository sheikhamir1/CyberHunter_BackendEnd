const express = require("express");
const Router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

Router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await RegisteredUser.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: "User with this email not found" });
  }

  try {
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const resetURL = `http://localhost:3000/resetpassword/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `
      <h1>You have requested a password reset</h1>
    <p>Please click on the link below to reset your password:</p>
    <a href="${resetURL}" clicktracking="off">${resetURL}</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error sending email:", err);
        return res
          .status(500)
          .json({ success: false, msg: "Failed to send reset email" });
      }
      console.log("Email sent:", info.response);
      console.log("Email sent:", info.envelope);
      res
        .status(200)
        .json({ success: true, msg: "Token sent to your email address" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = Router;
