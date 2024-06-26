const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");
const UpdateEmailValidator = require("./EmailValidator");
const { validationResult } = require("express-validator");

Router.put(
  "/update",
  CheckIfUserLoggedIn,
  UpdateEmailValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const { email, fullName } = req.body;
    const userId = req.user.user;

    // console.log("this is userId", userId);
    // console.log("this is userId before try", userId);

    const alreadyExists = await RegisteredUser.findOne({ email });
    if (alreadyExists) {
      // console.log("this is alreadyExists", alreadyExists);
      return res
        .status(400)
        .json({ success: false, msg: "Email already exists" });
    }

    try {
      const existingUsers = await RegisteredUser.findOneAndUpdate({
        author: userId.id,
      }).select("-password -confirmPassword");
      //   console.log("this is userId after try", userId);
      // console.log("this is existingUsers", existingUsers);
      if (existingUsers) {
        existingUsers.email = email;
        existingUsers.fullName = fullName;
        await existingUsers.save();

        return res.status(200).json({
          success: true,
          userProfile: existingUsers,
          msg: "Email updated successfully",
        });
      }
      // console.log("this is existingUsers", existingUsers);

      //   console.log("req.body", req.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: "server error" });
    }
  }
);

module.exports = Router;
