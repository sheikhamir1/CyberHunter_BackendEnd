const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get(
  "/blogsbycategory/:categories",
  CheckIfUserLoggedIn,
  async (req, res) => {
    const { categories } = req.params;
    const userId = req.user.user;

    try {
      //   const userId = req.user.user;
      const blogs = await createBlog
        .find({ author: userId.id, categories })
        .populate("author", "fullName")
        .populate("postLikes");

      //   console.log("this is blogs", blogs);

      const blogsWithLikeCounts = blogs.map((blog) => ({
        ...blog._doc,
        likeCount: blog.postLikes.length,
      }));

      //   console.log("this is blogsWithLikeCounts", blogsWithLikeCounts);
      res.status(200).json({ success: true, data: blogsWithLikeCounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

module.exports = router;
