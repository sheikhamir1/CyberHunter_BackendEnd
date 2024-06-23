const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
    },
    authorFullName: {
      type: String,
    },

    tags: {
      type: [String],
      required: true,
    },

    categories: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      required: true,
    },

    publicAt: {
      type: Date,
      default: Date.now,
    },
    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],

    Comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  { timestamps: true }
);

const createBlog = mongoose.model("createBlog", blogSchema);

module.exports = createBlog;
