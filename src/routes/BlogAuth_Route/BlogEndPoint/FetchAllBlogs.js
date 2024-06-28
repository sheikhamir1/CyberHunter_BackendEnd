const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/fetchblogs", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user;
    // console.log("this is userId", userId);

    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await createBlog
      .find({ author: userId.id })
      .populate("author", "fullName")
      .populate("postLikes")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await createBlog.countDocuments({ author: userId.id });

    const blogsWithLikeCounts = blogs.map((blog) => ({
      ...blog._doc, // Spread existing blog properties
      likeCount: blog.postLikes.length, // Add likeCount property
    }));

    res.status(200).json({
      success: true,
      data: blogsWithLikeCounts,
      total: totalBlogs,
      page,
      pages: Math.ceil(totalBlogs / limit),
    });

    // console.log("this is blogsWithLikeCounts", blogsWithLikeCounts);

    // console.log("this is blogsWithLikeCounts", blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
