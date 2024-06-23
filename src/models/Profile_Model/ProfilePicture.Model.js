const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
      fullName: { type: String },
    },
  },
  { timestamps: true }
);

const ProfilePicture = mongoose.model("ProfilePicture", PictureSchema);

module.exports = ProfilePicture;
