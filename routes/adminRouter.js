const express = require('express')
const adminRouter = express.Router()
const Admin = require('../models/admin');
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment')


adminRouter.get('/', async(req, res, next)=>{
  const admindata = await Admin.find({})
  const allusers = await User.find({})
  const allblogs = await Blog.find({})
  const allComment = await Comment.find({})

  if(!admindata){
      await Admin.create({
        fullName: 'admin',
        email: 'admin@gmail.com',
        blogId: allblogs,
        createdBy: allusers,
    })
  }else {
    await Admin.findOneAndUpdate(admindata._id, { createdBy: allusers, blogId: allblogs} )
  }

  return res.render("adminpage", {admin: admindata, allusers, allblogs, allComment});
})

adminRouter.get('/signup',(req, res) => {
  return res.render("signup"); 
}).get('/signin', (req, res) => {
  return res.render("signin"); 
})

adminRouter.get('/alluser', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const alluser = await User.find({})

  return res.render("alluser", {admin: admindata, alluser: alluser});
} )

adminRouter.get('/allblog', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const allblog = await Blog.find({})
  const alluser = await User.find({})
  const allComment = await Comment.find({})

  return res.render("allblog", {admin: admindata, allblog: allblog, alluser: alluser, allComment: allComment});
} )

adminRouter.get('/isapproved/:userid', async(req, res)=>{
  const user = await User.findById(req.params.userid)
  await User.findByIdAndUpdate(req.params.userid, {isApproved: !user.isApproved})

  return res.redirect('/admin/alluser')
})

adminRouter.get('/delete', async(req, res)=>{
  await Blog.deleteMany({ createdBy: req.params.userid })
  await Comment.deleteMany({ createdBy: req.params.userid })
  await User.deleteOne({ _id: req.params.userid })

  return res.clearCookie('token').redirect('/admin/alluser')
})

module.exports = adminRouter
