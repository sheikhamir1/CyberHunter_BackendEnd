const express = require("express");
const Router = express.Router();
const registerValidator = require("../UserValidation/RegisterValidator");
const { validationResult } = require("express-validator");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 600000; // 10 min from now

  await user.save();

  const verificationURL = `https://cyberhunter-six.vercel.app/verify_email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify Your Email Address",
    html: `<h1>Hi ${user.fullName},</h1>
           <p>Thank you for registering on Cyber hunter!</p>
           <p>Please verify your email address by clicking the link below:</p>
           <a href=${verificationURL}>${verificationURL}</a>
           <p>If you did not create an account, please ignore this email.</p>
           <p>Best regards,<br>Cyber hunter Team</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: " + err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

Router.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  // console.log("this is body", req.body);
  let { fullName, email, password, confirmPassword } = req.body;

  const existingUsers = await RegisteredUser.findOne({ email });
  if (existingUsers) {
    return res
      .status(400)
      .json({ success: false, message: "user already exists" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
    confirmPassword = hashedPassword;
    // console.log("this is hashed password", hashedPassword);

    const newUser = new RegisteredUser({
      fullName,
      email,
      password,
      confirmPassword,
    });
    // console.log("this is new user", newUser);
    await newUser.save();
    await sendVerificationEmail(newUser);

    res.status(200).json({
      success: true,
      message: "user register successfully please verify your email to login",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error register" });
  }
});

module.exports = Router;
