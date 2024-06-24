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

Router.put(
  "/profileupdate/:id",
  CheckIfUserLoggedIn,
  upload.fields([{ name: "file" }]),
  async (req, res) => {
    //   console.log("Request Body:", req.body);
    const userId = req.user.user;
    const { username, bio, age, city, country } = req.body;
    //   console.log("this is author in profile", userId);
    // let updateFields = { username, bio, age, city, country };
    console.log("this is req file", req.file);
    console.log("this is req files", req.files);
    if (!userId) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    const existingProfile = await Profile.findOne({ author: userId.id });
    if (!existingProfile) {
      return res.status(400).json({ success: false, msg: "Profile not found" });
    }

    if (req.files && req.files["file"]) {
      const file = req.files["file"][0];

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
      const imageUrl = uploadResult.secure_url;

      try {
        const updatedProfile = await Profile.findOneAndUpdate(
          { author: userId.id },
          {
            username,
            bio,
            age,
            city,
            country,
            imageUrl,
          }
        );

        // console.log("this is updated profile", updatedProfile);
        // await updatedProfile.save();
        return res.status(200).json({
          success: true,
          msg: "Profile updated successfully",
          // data: updatedProfile,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
      }
    }
  }
);
module.exports = Router;
