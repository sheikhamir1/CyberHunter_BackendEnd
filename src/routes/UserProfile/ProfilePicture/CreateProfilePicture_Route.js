const express = require("express");
const multer = require("multer");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const ProfilePicture = require("../../../models/Profile_Model/ProfilePicture.Model");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/profile-picture",
  CheckIfUserLoggedIn,
  upload.single("profilePic"),
  async (req, res) => {
    // console.log("Request file:", req.file);
    // console.log("this is userId", userId);

    const userId = req.user.user;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, msg: "Profile image is required" });
    }

    if (!userId) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    const existingProfile = await ProfilePicture.findOne({
      author: userId.id,
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ success: false, msg: "Profile already exists" });
    }

    try {
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
        uploadStream.end(req.file.buffer);
      });

      const savePicture = new ProfilePicture({
        url: uploadResult.secure_url,
      });
      await savePicture.save();

      res
        .status(200)
        .json({ message: "Image uploaded successfully", image: savePicture });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
