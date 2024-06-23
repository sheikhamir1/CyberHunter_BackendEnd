const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    age: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    imageCaption: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
