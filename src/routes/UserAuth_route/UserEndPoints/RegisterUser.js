const express = require("express");
const Router = express.Router();
const registerValidator = require("../UserValidation/RegisterValidator");
const { validationResult } = require("express-validator");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
JWT_SECRET_KEY = process.env.JWT_ACCESS_TOKEN;

Router.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  // console.log("this is body", req.body);
  let { fullName, email, password, confirmPassword } = req.body;

  const existingUsers = await RegisteredUser.findOne({ email });
  if (existingUsers) {
    return res
      .status(400)
      .json({ success: false, message: "user already exists" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
    confirmPassword = hashedPassword;
    // console.log("this is hashed password", hashedPassword);

    const newUser = new RegisteredUser({
      fullName,
      email,
      password,
      confirmPassword,
    });
    // console.log("this is new user", newUser);
    await newUser.save();

    const JWT_Token = JWT_SECRET_KEY;
    // console.log("this is secretkey", JWT_Token);
    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    };
    const authToken = jwt.sign(payload, JWT_Token, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    // console.log("auth-token", authToken);
    res.status(200).json({
      success: true,
      authToken,
      message: "user register successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error register" });
  }
});

//
async function clearDatabase() {
  const result = await RegisteredUser.deleteOne({});
  console.log(result);
}
// clearDatabase();

module.exports = Router;
