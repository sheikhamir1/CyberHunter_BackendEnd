const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const Profile = require("../../models/Profile_Model/Profile.Model");

Router.post("/Createprofile", CheckIfUserLoggedIn, async (req, res) => {
  // console.log("Request Body:", req.body);

  const { username, bio, age, city, country, imageCaption } = req.body;
  const userId = req.user.user;
  // console.log("this is author in profile", userId);

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User not found" });
  }

  const existingProfile = await Profile.findOne({ author: userId.id });
  if (existingProfile) {
    return res
      .status(400)
      .json({ success: false, msg: "Profile already exists" });
  }

  try {
    const NewProfile = new Profile({
      author: { _id: userId.id, fullName: userId.fullName },
      username,
      bio,
      age,
      city,
      country,
      imageCaption,
    });
    // console.log("this is new profile", NewProfile);

    await NewProfile.save();
    return res.status(200).json({
      success: true,
      msg: "Profile created successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = Router;
