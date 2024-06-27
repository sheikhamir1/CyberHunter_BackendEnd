const express = require("express");
const router = express.Router();
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");
const bcrypt = require("bcrypt");

// Route to reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  let { password, confirmPassword } = req.body;

  //   console.log("this is token", token);
  //   console.log("this is password", password);
  //   console.log("this is confirmPassword", confirmPassword);

  try {
    const user = await RegisteredUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // console.log("user", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Password reset token is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
    confirmPassword = hashedPassword;

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, msg: "Password has been reset" });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error in password reset with token ",
    });
  }
});

module.exports = router;
