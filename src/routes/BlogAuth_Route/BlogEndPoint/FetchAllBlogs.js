const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/fetchblogs", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user;
    // console.log("this is userId", userId);

    const blogs = await createBlog
      .find({ author: userId.id })
      .populate("author", "fullName")
      .populate("postLikes");

    const blogsWithLikeCounts = blogs.map((blog) => ({
      ...blog._doc, // Spread existing blog properties
      likeCount: blog.postLikes.length, // Add likeCount property
    }));

    res.status(200).json({ success: true, data: blogsWithLikeCounts });
    // console.log("this is blogsWithLikeCounts", blogsWithLikeCounts);

    // console.log("this is blogsWithLikeCounts", blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
