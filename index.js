require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoDbConnect = require("./src/mongodb/ConnectToMongoDb");
const cors = require("cors");
mongoDbConnect();

const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // user authentication routes
app.use(
  "/api/auth",
  require("./src/routes/UserAuth_route/UserEndPoints/LoginUser")
);
app.use(
  "/api/auth",
  require("./src/routes/UserAuth_route/UserEndPoints/RegisterUser")
);
// app.use("/api/auth", require("./Routes/userAuth/CheckIfUserAuth"));
app.use(
  "/api/user",
  require("./src/routes/UserProfile/CreateNewProfile_Route")
);
app.use("/api/user", require("./src/routes/UserProfile/UpdateProfile_Route"));
app.use("/api/user", require("./src/routes/UserProfile/FetchProfile_Route"));

// app.use("/api/user", require("./Routes/userAuth/GetEmail"));
// app.use("/api/user", require("./Routes/userAuth/UpdateEmail"));
// app.use("/api/user", require("./Routes/userAuth/ResetPassword"));
// app.use("/api/user", require("./Routes/userAuth/UserProfilePictureUpdate"));

// // blog authentication routes
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
  require(".//src/routes/BlogAuth_Route/BlogEndPoint/FetchAllPrivateBlogs_Route")
);

// // like and comment routes
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/LikePost_Route")
);
app.use(
  "/api/blog",
  require("./src/routes/Like_Comment_Share_Route/DislikePost_Route")
);
// app.use("/api/blog", require("./Routes/like/Comment"));
// app.use("/api/blog", require("./Routes/like/GetComments"));
// app.use("/api/blog", require("./Routes/like/EditComment"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
