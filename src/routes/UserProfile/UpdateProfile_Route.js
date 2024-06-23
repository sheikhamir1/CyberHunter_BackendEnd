const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const Profile = require("../../models/Profile_Model/Profile.Model");

Router.put("/profileupdate/:id", CheckIfUserLoggedIn, async (req, res) => {
  //   console.log("Request Body:", req.body);
  const { username, bio, age, city, country, imageCaption } = req.body;
  const userId = req.user.user;
  //   console.log("this is author in profile", userId);

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User not found" });
  }

  const existingProfile = await Profile.findOne({ author: userId.id });
  if (!existingProfile) {
    return res.status(400).json({ success: false, msg: "Profile not found" });
  }
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { author: userId.id },
      {
        username,
        bio,
        age,
        city,
        country,
        imageCaption,
      }
    );

    // console.log("this is updated profile", updatedProfile);
    // await updatedProfile.save();
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}),
  (module.exports = Router);
