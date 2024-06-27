const express = require("express");
const router = express.Router();
const createBlog = require("../../../models/BlogAuth_Model/Blog.model");

router.get("/search", async (req, res) => {
  const { query } = req.query;

  // Check if query is not undefined and is a string
  if (typeof query !== "string" || !query.trim()) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid search query" });
  }

  try {
    const blogs = await createBlog
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Case-insensitive title search
          { content: { $regex: query, $options: "i" } }, // Case-insensitive content search
          { tags: { $regex: query, $options: "i" } }, // Case-insensitive content search
          { categories: { $regex: query, $options: "i" } }, // Case-insensitive content search
        ],
      })
      .populate("author", "fullName"); // Populate author information if needed

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
