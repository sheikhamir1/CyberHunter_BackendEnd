const express = require("express");
const Router = express.Router();
const loginValidator = require("../UserValidation/LoginValidator");
const { validationResult } = require("express-validator");
const RegisteredUser = require("../../../models/UserAuth_Model/RegisteredUser.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
JWT_SECRET_KEY = process.env.JWT_ACCESS_TOKEN;

Router.post("/login", loginValidator, async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, error: error.array() });
  }

  const { email, password } = req.body;
  try {
    const existingUsers = await RegisteredUser.findOne({ email });
    if (!existingUsers) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    if (!existingUsers.isVerified) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Email not verified please verify to login",
        });
    }

    // console.log("Plaintext Password:", password);
    // console.log("Hashed Password:", existingUsers.password);

    const ismatched = await bcrypt.compare(
      password.toString(),
      existingUsers.password
    );
    if (!ismatched) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }
    const JWT_Token = JWT_SECRET_KEY;
    // console.log("this is secretkey", JWT_Token);

    // console.log("this is existingUsers._id", existingUsers._id);
    const payload = {
      user: {
        id: existingUsers._id,
        email: existingUsers.email,
      },
    };
    const authToken = jwt.sign(payload, JWT_Token, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    // console.log(authToken);
    res.status(200).json({
      success: true,
      authToken,
      message: "user logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error login" });
  }
});

module.exports = Router;
