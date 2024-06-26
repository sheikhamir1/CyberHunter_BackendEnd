const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "createBlog",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const CommentPost = mongoose.model("CommentPost", CommentSchema);

module.exports = CommentPost;
