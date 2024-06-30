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
    const userId = req.user.user.id; // Extract the id from userId object

    console.log("UserID in update email:", userId);

    const alreadyExists = await RegisteredUser.findOne({ email });
    if (alreadyExists) {
      console.log("Email already exists:", alreadyExists);
      return res
        .status(400)
        .json({ success: false, msg: "Email already exists" });
    }

    try {
      // Use the extracted userId to find and update the user
      const existingUser = await RegisteredUser.findOneAndUpdate(
        { _id: userId }, // Use `_id` field to find the user
        { $set: { email, fullName } },
        { new: true, select: "-password -confirmPassword" } // options to return the new document and exclude sensitive fields
      );

      console.log("Existing user after update attempt:", existingUser);
      if (existingUser) {
        console.log("User successfully updated:", existingUser);
        return res.status(200).json({
          success: true,
          userProfile: existingUser,
          msg: "Email updated successfully",
        });
      } else {
        console.log("User not found with ID:", userId);
        return res.status(404).json({
          success: false,
          msg: "User not found",
        });
      }
    } catch (error) {
      console.error("Error updating email:", error);
      return res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

module.exports = Router;
