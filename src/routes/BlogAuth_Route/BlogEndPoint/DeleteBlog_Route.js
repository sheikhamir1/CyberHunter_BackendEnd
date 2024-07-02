const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");
const LikePost = require("../../../models/Like_Comment_Share.Model/LikePost.Model");
const CommentPost = require("../../../models/Like_Comment_Share.Model/Comment.Model");

router.delete("/deleteblog/:id", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.user.id;

    // console.log("Blog ID to delete:", blogId);
    // console.log("User ID:", userId);

    // Fetch and log likes and comments before deletion
    // const likes = await LikePost.find({ postId: blogId });
    // const comments = await CommentPost.find({ postId: blogId });

    // console.log("Likes to delete:", likes);
    // console.log("Comments to delete:", comments);

    const deletedBlog = await createBlog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }
    if (deletedBlog.author.toString() !== userId) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized access" });
    }

    console.log("Deleted Blog:", deletedBlog);

    const deletedLikes = await LikePost.deleteMany({ postId: blogId });
    const deletedComments = await CommentPost.deleteMany({ postId: blogId });

    console.log("Deleted Likes:", deletedLikes);
    console.log("Deleted Comments:", deletedComments);

    res.status(200).json({
      success: true,
      blog: deletedBlog,
      msg: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
