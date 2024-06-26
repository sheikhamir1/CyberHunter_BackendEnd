const { body } = require("express-validator");

const UpdateEmailValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Please Enter a valid Email Address"),
  body("fullName").not().isEmpty().withMessage("fullName Name is required"),
  body("fullName")
    .isLength({ min: 6, max: 20 })
    .withMessage("fullName Name must be between 6 and 20 characters"),
];

module.exports = UpdateEmailValidator;
