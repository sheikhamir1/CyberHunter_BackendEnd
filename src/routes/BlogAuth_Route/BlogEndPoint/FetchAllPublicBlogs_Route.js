const express = require("express");
const router = express.Router();
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/publicblog", async (req, res) => {
  try {
    const publicBlog = await createBlog
      .find({ isPublic: true })
      .populate("author", "fullName")
      .populate("postLikes");

    const publicblogWithCount = publicBlog.map((blog) => ({
      ...blog._doc, // Spread existing blog properties
      likeCount: blog.postLikes.length, // Add likeCount property
    }));

    res.status(200).json({ success: true, data: publicblogWithCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
