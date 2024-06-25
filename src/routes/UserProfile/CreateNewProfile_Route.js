const express = require("express");
const Router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const Profile = require("../../models/Profile_Model/Profile.Model");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

Router.post(
  "/Createprofile",
  CheckIfUserLoggedIn,
  upload.fields([{ name: "file" }]),
  async (req, res) => {
    // console.log("Request Body:", req.body);

    // console.log("this is req file", req.file);
    // console.log("this is req files", req.files);
    const userId = req.user.user;
    const { username, bio, age, city, country } = req.body;
    const existingProfileImage = await Profile.findOne({
      author: userId.id,
    });

    if (existingProfileImage) {
      return res
        .status(400)
        .json({ success: false, msg: "Profile image already exists" });
    }

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
      const file = req.files["file"][0];
      if (!file) {
        return res
          .status(400)
          .json({ success: false, msg: "Profile image is required" });
      }

      // Upload the file to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
      // console.log("this is uploadResult", uploadResult);
      const url = uploadResult.secure_url;

      const NewProfile = new Profile({
        author: { _id: userId.id, fullName: userId.fullName },
        username,
        bio,
        age,
        city,
        country,
        url,
      });
      // console.log("this is new profile", NewProfile);

      await NewProfile.save();
      return res.status(200).json({
        success: true,
        msg: "Profile created successfully",
        profile: NewProfile,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error in cloudinary");
    }
  }
);

module.exports = Router;
