const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");
const { validationResult } = require("express-validator");
const blogValidator = require("../BlogValidator/BlogValidator");

router.put(
  "/updateblog/:id",
  CheckIfUserLoggedIn,
  blogValidator,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success: false, error: error.array() });
    }
    try {
      const { title, content, tags, categories, isPublic, publicAt } = req.body;
      const blogId = req.params.id;

      // console.log("this is blogId", blogId);
      const newBlog = {};
      if (title) {
        newBlog.title = title;
      }
      if (content) {
        newBlog.content = content;
      }
      if (tags) {
        newBlog.tags = tags;
      }
      if (categories) {
        newBlog.categories = categories;
      }
      if (isPublic) {
        newBlog.isPublic = isPublic;
      }
      if (publicAt) {
        newBlog.publicAt = publicAt;
      }
      const updatedBlog = await createBlog.findByIdAndUpdate(blogId, newBlog, {
        new: true,
      });

      // console.log("this is updatedBlog", updatedBlog);
      if (!updatedBlog) {
        return res.status(404).json({ success: false, msg: "Blog not found" });
      }
      if (updatedBlog.author.toString() !== req.user.user.id) {
        return res
          .status(401)
          .json({ success: false, msg: "Unauthorized access" });
      }

      res.status(200).json({
        success: true,
        blog: updatedBlog,
        msg: "Blog updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

module.exports = router;
