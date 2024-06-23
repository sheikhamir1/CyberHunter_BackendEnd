const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const Profile = require("../../models/Profile_Model/Profile.Model");

Router.get("/fetchprofile", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user;
    // console.log("this is userId", userId);

    const userProfile = await Profile.find({ author: userId.id }).populate(
      "author",
      "fullName"
    );

    if (!userProfile) {
      return res.status(404).json({ success: false, msg: "no profile found" });
    }
    // console.log("profile not found");
    // console.log("this is userId after", userId);
    // console.log("this is userProfile", userProfile);
    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
});

module.exports = Router;
