const express = require("express");
const router = express.Router();
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");

router.get("/Verify_email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await RegisteredUser.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Verification token is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      msg: "Email has been verified. You can now log in.",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
