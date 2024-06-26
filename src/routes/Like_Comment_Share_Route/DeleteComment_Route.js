const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const CommentPost = require("../../models/Like_Comment_Share.Model/Comment.Model");
const createBlog = require("../../models/BlogAuth_Model/Blog.model");

router.delete(
  "/:commentId/deletecomment",
  CheckIfUserLoggedIn,
  async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.user.id;
    if (!commentId) {
      return res
        .status(400)
        .json({ success: false, msg: "Comment ID is required" });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });
    }
    try {
      const deletedComment = await CommentPost.findByIdAndDelete(commentId);
      return res.status(200).json({
        success: true,
        data: deletedComment,
        msg: "Comment deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

module.exports = router;
