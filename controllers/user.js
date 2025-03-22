const Blog = require('../models/blog')
const Comment = require('../models/comment')
const User = require('../models/user')


const getuserSignup = (req, res) => {
  return res.render("signup");
}

const postuserSignup = async(req, res) => {
  const { fullName, email, password, role } = req.body;
  const imagepath = req.file ? `/profile/${req.file.filename}` : '/images/default_profile.png'
  await User.create({
    fullName,
    email,
    password,
    profileImage: imagepath,
    role,
  });
  return res.render("signin");
}

const getuserSignin = (req, res) => {
  return res.render("signin");
}

const postuserSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");    
  } catch (error) {
    return res.status(401).render('signin',{ error: "Invalid Email or Password"})
  }
}

const userLogout = (req, res)=>{
  return res.clearCookie('token').redirect('/')
}

const deleteUser = async(req, res)=>{
  await Blog.deleteMany({ createdBy: req.params.userid })
  await Comment.deleteMany({ createdBy: req.params.userid })
  await User.deleteOne({ _id: req.params.userid })

  return res.clearCookie('token').redirect('/')
}

module.exports = { getuserSignup, postuserSignup, getuserSignin, postuserSignin, userLogout, deleteUser }