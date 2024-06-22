require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoDbConnect = require("./src/mongodb/ConnectToMongoDb");
const cors = require("cors");
mongoDbConnect();

// const port = 3000;
const port = process.env.PORT || 4000;
app.use(cors());

// app.use("/api/user", require("./Routes/userAuth/GetUserProfilePicture"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // user authentication routes
// app.use("/api/auth", require("./Routes/userAuth/Login"));
app.use(
  "/api/auth",
  require("./src/routes/UserAuth_route/UserEndPoints/RegisterUser")
);
// app.use("/api/auth", require("./Routes/userAuth/CheckIfUserAuth"));
// app.use("/api/user", require("./Routes/userAuth/userProfile"));
// app.use("/api/user", require("./Routes/userAuth/UserProfilePicture"));
// app.use("/api/user", require("./Routes/userAuth/GetUserProfile"));
// app.use("/api/user", require("./Routes/userAuth/GetEmail"));
// app.use("/api/user", require("./Routes/userAuth/UpdateEmail"));
// app.use("/api/user", require("./Routes/userAuth/ResetPassword"));
// app.use("/api/user", require("./Routes/userAuth/UserProfileUpdate"));
// app.use("/api/user", require("./Routes/userAuth/UserProfilePictureUpdate"));

// // blog authentication routes
// app.use("/api/blog", require("./Routes/blogAuth/blog"));
// app.use("/api/blog", require("./Routes/blogAuth/createBlog"));
// app.use("/api/blog", require("./Routes/blogAuth/updateBlog"));
// app.use("/api/blog", require("./Routes/blogAuth/deleteBlog"));
// app.use("/api/blog", require("./Routes/blogAuth/PublicBlog"));
// app.use("/api/blog", require("./Routes/blogAuth/PrivetBLog"));

// // like and comment routes
// app.use("/api/blog", require("./Routes/like/Like"));
// app.use("/api/blog", require("./Routes/like/Dislike"));
// app.use("/api/blog", require("./Routes/like/Comment"));
// app.use("/api/blog", require("./Routes/like/GetComments"));
// app.use("/api/blog", require("./Routes/like/EditComment"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
