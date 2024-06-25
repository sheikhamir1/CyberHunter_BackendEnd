const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "createBlog",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
    },
    likePost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const LikePost = mongoose.model("LikePost", LikeSchema);

module.exports = LikePost;
