const { body } = require("express-validator");

const blogValidator = [
  body("title")
    .isLength({ min: 2 })
    .withMessage("title must be atleast 2 chars"),
  body("content")
    .isLength({ min: 2 })
    .withMessage("content must be atleast 2 chars"),
  body("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be atleast 1")
    .custom((tags) => {
      // Check if all tags are strings and have a minimum length
      return tags.every(
        (tag) => typeof tag === "string" && tag.trim().length > 0
      );
    })
    .withMessage("All tags must be non-empty strings"),
];

module.exports = blogValidator;
