const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../middleware/CheckUserLogin");
const LikePost = require("../../models/Like_Comment_Share.Model/LikePost.Model");
const createBlog = require("../../models/BlogAuth_Model/Blog.model");

router.delete("/:postId/dislikepost", CheckIfUserLoggedIn, async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ success: false, msg: "Post ID is required" });
  }
  const userId = req.user.user.id;
  //   console.log("this is userId", userId);

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, msg: "Body is required" });
  }

  try {
    const existingLike = await LikePost.findOne({
      postId: postId,
      userId: userId,
    });
    if (existingLike) {
      if (!existingLike.likePost) {
        return res
          .status(400)
          .json({ success: false, msg: "Post already Disliked" });
      } else if (existingLike.likePost) {
        existingLike.likePost = false;
        await existingLike.save();
        await createBlog
          .findByIdAndUpdate(
            postId,
            {
              $pull: { postLikes: existingLike._id },
            },
            { new: true }
          )
          .populate("postLikes");

        return res.status(200).json({
          success: true,
          data: existingLike,
          msg: "Post Disliked successfully",
        });
      }
    } else {
      const newLike = new LikePost({
        postId: postId,
        userId: userId,
        likePost: false,
      });
      // console.log("this is newLike", newLike);
      await newLike.save();
      await createBlog
        .findByIdAndUpdate(
          postId,
          {
            $pull: { postLikes: newLike._id },
          },
          { new: true }
        )
        .populate("postLikes");

      return res.status(200).json({
        success: true,
        data: newLike,
        msg: "Post Disliked successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
