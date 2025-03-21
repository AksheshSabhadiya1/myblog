require('dotenv').config()

const express = require("express");
const app = express();
const port = process.env.PORT || 8005;
const path = require("path");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const cookieParser = require("cookie-parser");
const { checkAuthCookie } = require("./middleware/auth");


mongoose
  .connect(process.env.Mongo_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Not Connected ", error));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthCookie("token"));
app.use(express.static(path.resolve("./public")))

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const allblogs = await Blog.find({})
  res.render("homepage", { user: req.user, blogs: allblogs });
});

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
