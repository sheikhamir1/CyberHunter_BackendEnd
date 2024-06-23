const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");
const { validationResult } = require("express-validator");
const blogValidator = require("../BlogValidator/BlogValidator");

router.post(
  "/createblog",
  CheckIfUserLoggedIn,
  blogValidator,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success: false, error: error.array() });
    }
    try {
      const { title, content, tags, categories, isPublic, publicAt } = req.body;

      // console.log("this is req.body", req.body);

      const userId = req.user.user.id;

      // console.log("this is userId", userId);
      const newBlog = new createBlog({
        title,
        content,
        author: userId,
        authorFullName: req.user.user.fullName,
        tags,
        categories,
        isPublic,
        publicAt,
      });
      // console.log("this is newBlog", newBlog);

      await newBlog.save();
      return res
        .status(200)
        .json({ success: true, msg: "Blog created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

module.exports = router;
