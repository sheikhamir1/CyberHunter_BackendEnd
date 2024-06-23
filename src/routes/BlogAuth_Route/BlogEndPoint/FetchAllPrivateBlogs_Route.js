const express = require("express");
const router = express.Router();
const CheckIfUserLoggedIn = require("../../../middleware/CheckUserLogin");
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/privetblog", CheckIfUserLoggedIn, async (req, res) => {
  try {
    const userId = req.user.user;
    // console.log("this is userId", userId);

    const privetBlog = await createBlog.find({
      author: userId.id,
      isPublic: false,
    });
    // console.log("this is privetBlog", privetBlog);
    //   .select("-content -author -tags -categories -isPublic");
    res.status(200).json({ success: true, privetBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
