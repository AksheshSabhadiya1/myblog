const { Router } = require('express')
const Admin = require('../models/admin')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const adminRouter = Router()


adminRouter.get('/', async(req, res)=>{
  const admin = req.admin ? await Admin.findOne({_id: req.admin._id}) : req.admin
  const allusers = await User.find({})
  const allblogs = await Blog.find({})
  const allComment = await Comment.find({})

  res.render("adminpage", { admin: admin, allusers, allblogs, allComment})
})


adminRouter.get('/signup', async(req, res)=>{
  return res.render('adminsignup')
})


adminRouter.post('/signup', async(req, res)=>{
  const { fullName, email, password, role } = req.body
  const imagepath = req.file ? `/profile/${req.file.filename}` : '/images/default_profile.png'

  await Admin.create({
    fullName,
    email,
    password,
    profileImage: imagepath,
    role,
  })
  return res.render('adminsignin')
})


adminRouter.get('/signin', async(req, res)=>{
  return res.render('adminsignin')
})


adminRouter.post('/signin', async(req, res)=>{
  const { email, password } = req.body
  const admin = await Admin.findOne({email: email})

  if(!admin) return res.status(401).render('adminsignup', {error: "Admin Not Found"})

  try {
    const admintoken = await Admin.matchPasswordAndGenerateTokenForAdmin(email, password)
    
    return res.cookie("admintoken", admintoken).redirect('/admin')
    
  } catch (error) {
    return res.status(404).render('adminsignin',{error: "Invalid Email or Password"})
  }
})


adminRouter.get('/alluser', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const alluser = await User.find({})

  return res.render("alluser", {admin: admindata, alluser: alluser});
})

adminRouter.get('/allblog',async(req, res)=>{
  const admindata = await Admin.findOne({})
  const allblog = await Blog.find({})
  const alluser = await User.find({})
  const allComment = await Comment.find({})

  return res.render("allblog", {admin: admindata, allblog: allblog, alluser: alluser, allComment: allComment});
})


adminRouter.get('/isApproved/:userid', async(req, res)=>{
  const user = await User.findById(req.params.userid)
  await User.findByIdAndUpdate(req.params.userid, {isApproved: !user.isApproved, adminId: req.admin._id})

  return res.redirect('/admin/alluser')
})


adminRouter.get('/logout/:userid', async(req, res)=>{
  return res.clearCookie('admintoken').redirect('/admin')
})


adminRouter.get('/delete/:adminid', async(req, res)=>{
  await Comment.deleteMany({createdBy: req.params.adminid})
  await Blog.deleteMany({createdBy: req.params.adminid})
  await User.deleteMany({adminId: req.params.adminid})
  await Admin.deleteOne({_id: req.params.adminid})

  return res.clearCookie('admintoken').redirect('/admin')
})


module.exports = adminRouter