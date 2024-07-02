const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model"); // Adjust the path as needed

const router = express.Router();

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// console.log("this is transporter", transporter);

const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 600000; // 10 min from now

  await user.save();

  const verificationURL = `https://cyberhunter-six.vercel.app/Verify_email/${token}`;
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

  console.log("this is mailOptions", mailOptions);

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: " + err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.post("/resend-verification-email", async (req, res) => {
  const { email } = req.body;
  console.log("this is email", email);
  try {
    const user = await RegisteredUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "User is already verified" });
    }

    await sendVerificationEmail(user);
    res.status(200).json({ success: true, msg: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
