
const express = require("express");
const app = express();
const port = 8005;
const path = require("path");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
const superadminRouter = require('./routes/superadminRouter');
const adminRouter = require('./routes/adminRouter')
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const User = require('./models/user');
const cookieParser = require("cookie-parser");
const { checkAuthCookie, checkAdminCookie } = require("./middleware/auth");


mongoose
  .connect("mongodb://localhost:27017/myBlog")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Not Connected ", error));

app.set("view engine", "ejs");
app.set("views", [path.resolve("./views/Admin"), path.resolve("./views/User"), path.resolve("./views/superAdmin")]);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthCookie("token"));
app.use(checkAdminCookie("admintoken"))
app.use(express.static(path.resolve("./public")))

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/superadmin", superadminRouter)
app.use("/admin", adminRouter)


app.get("/", async (req, res) => {
  const allblogs = await Blog.find({})
  const user = req.user ? await User.findOne({_id: req.user._id}) : req.user 
  res.render("homepage", { user: user, blogs: allblogs }); 
});


app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
