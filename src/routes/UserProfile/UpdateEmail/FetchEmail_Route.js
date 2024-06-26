const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");

Router.get("/fetchemail", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user;
    // console.log("this is userId", userId);
    // const email = await userId.email;
    const LoginDetails = await RegisteredUser.findOne({
      _id: userId.id,
    }).select("-password -confirmPassword -date -createdAt -updatedAt");
    res.status(200).json({ success: true, LoginDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = Router;
