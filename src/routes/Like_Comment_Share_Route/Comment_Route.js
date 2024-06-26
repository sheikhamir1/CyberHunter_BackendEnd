const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const CommentPost = require("../../models/Like_Comment_Share.Model/Comment.Model");
const createBlog = require("../../models/BlogAuth_Model/Blog.model");

router.post("/:postId/comment", CheckIfUserLoggedIn, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.user.id;

  // console.log("this is req.body", req.body);

  if (!postId) {
    return res.status(400).json({ success: false, msg: "Post ID is required" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, msg: "Body is required" });
  }

  try {
    const newComment = new CommentPost({
      postId: postId,
      userId: userId,
      comment: req.body.comment,
    });
    // console.log("this is newComment", newComment);

    await newComment.save();
    await createBlog
      .findByIdAndUpdate(
        postId,
        {
          $push: { postComments: newComment._id },
        },
        { new: true }
      )
      .populate("postComments");
    return res.status(200).json({
      success: true,
      data: newComment,
      msg: "Comment created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = router;
