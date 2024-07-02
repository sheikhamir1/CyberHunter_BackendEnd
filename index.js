require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoDbConnect = require("./src/mongodb/ConnectToMongoDb");
const cors = require("cors");
// connect mongodb
mongoDbConnect();

const port = process.env.PORT || 4000;

const corsConfig = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // user authentication routes (register, login)
app.use(
  "/api/auth",
  require("./src/routes/UserAuth_route/UserEndPoints/LoginUser")
);
app.use(
  "/api/auth",
  require("./src/routes/UserAuth_route/UserEndPoints/RegisterUser")
);

// // user profile routes (create, update, fetch , verify email, resend token , updated email, fetch email)
app.use(
  "/api/user",
  require("./src/routes/UserProfile/CreateNewProfile_Route")
);
app.use("/api/user", require("./src/routes/UserProfile/UpdateProfile_Route"));
app.use("/api/user", require("./src/routes/UserProfile/FetchProfile_Route"));
app.use(
  "/api/user",
  require("./src/routes/UserAuth_route/UserEndPoints/ResendToken_Route")
);
app.use(
  "/api/user",
  require("./src/routes/UserAuth_route/UserEndPoints/VerifyUser_Route")
);
app.use(
  "/api/user",
  require("./src/routes/UserProfile/UpdateEmail/UpdateEmail_Route")
);
app.use(
  "/api/user",
  require("./src/routes/UserProfile/UpdateEmail/FetchEmail_Route")
);

// //reset password routes (reset password, reset password token)
app.use(
  "/api/user",
  require("./src/routes/UserProfile/ResetPassword/ResetPassword_Route")
);
app.use(
  "/api/user",
  require("./src/routes/UserProfile/ResetPassword/ResetPasswordToken_Route")
);

// // blog authentication routes (create, update, fetch , delete, fetch all public, fetch all private)
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/FetchAllBlogs")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/CreateBlog_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/UpdateBlog_route")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/DeleteBlog_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/FetchAllPublicBlogs_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/FetchAllPrivateBlogs_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/BlogEndPoint/FetchByCtegory_Route")
);

// // Search route ( search by title, content, tags, categories)
app.use(
  "/api/blog",
  require("./src/routes/BlogAuth_Route/SearchEndPoint/Search_Route")
);

// // like and comment routes (like, dislike, comment, fetch comment, edit comment, delete comment)
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/LikePost_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/DislikePost_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/Comment_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/FetchComment_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/EditComment_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/DeleteComment_Route")
);

app.use(
  "/api/user",
  require("./src/routes/ContextUs_Route/ContextUs_Route.jsx")
);

// testing route
app.get("/", (req, res) => {
  res.send("backend deployed!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
