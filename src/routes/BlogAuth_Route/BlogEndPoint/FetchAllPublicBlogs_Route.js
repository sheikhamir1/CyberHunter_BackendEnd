const express = require("express");
const router = express.Router();
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/publicblog", async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const publicBlog = await createBlog
      .find({ isPublic: true })
      .populate("author", "fullName")
      .populate("postLikes")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await createBlog.countDocuments({ isPublic: true });

    const publicblogWithCount = publicBlog.map((blog) => ({
      ...blog._doc, // Spread existing blog properties
      likeCount: blog.postLikes.length, // Add likeCount property
    }));

    res.status(200).json({
      success: true,
      data: publicblogWithCount,
      total: totalBlogs,
      page,
      pages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
