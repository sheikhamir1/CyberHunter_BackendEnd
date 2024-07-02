const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const ContextUs = require("../../models/ContextUs_Model/ContextUs.Model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

Router.post("/feedback", CheckIfUserLoggedIn, async (req, res) => {
  const { name, email, subject, message } = req.body.feedback;

  // console.log("req.body", req.body);

  const userId = req.user.user;

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }

  const contextUs = new ContextUs({
    name,
    email,
    subject,
    message,
  });
  try {
    await contextUs.save();

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `Feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, msg: "Message sent successfully" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = Router;
