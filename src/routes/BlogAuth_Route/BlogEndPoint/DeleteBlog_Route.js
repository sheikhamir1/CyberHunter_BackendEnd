const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.delete("/deleteblog/:id", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await createBlog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }
    if (deletedBlog.author.toString() !== req.user.user.id) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized access" });
    }

    res.status(200).json({
      success: true,
      blog: deletedBlog,
      msg: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
