const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const CommentPost = require("../../models/Like_Comment_Share.Model/Comment.Model");
const createBlog = require("../../models/BlogAuth_Model/Blog.model");

router.get("/:postId/fetchcomments", CheckIfUserLoggedIn, async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await CommentPost.find({ postId: postId }).populate(
      "userId",
      "fullName"
    );

    // console.log("this is comments", comments);
    return res.status(200).json({
      success: true,
      data: comments,
      msg: "Comments fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = router;
