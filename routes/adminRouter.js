const express = require('express')
const adminRouter = express.Router()
const Admin = require('../models/admin');
const User = require('../models/user');
const Blog = require('../models/blog');

adminRouter.get('/', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const allusers = await User.find({})
  const allblogs = await Blog.find({})

  console.log(admindata);
  return res.render("homepage", {admin: admindata, allusers, allblogs});
} )

adminRouter.get('/alluser', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const alluser = await User.find({})
  return res.render("alluser", {admin: admindata, alluser: alluser});
} )

adminRouter.get('/allblog', async(req, res)=>{
  const admindata = await Admin.findOne({})
  const allblog = await Blog.find({})
  return res.render("allblog", {admin: admindata, allblog: allblog});
} )

adminRouter.get('/isapproved/:userid', async(req, res)=>{
  const user = await User.findById({ _id: req.params.userid })
  if(user){
    await User.updateOne({_id: req.params.userid },{$set: {isApproved: !user.isApproved}})
  }
  return res.redirect('/admin/alluser')
})

adminRouter.get('/delete', async(req, res)=>{
  await Blog.deleteMany({ createdBy: req.params.userid })
  await Comment.deleteMany({ createdBy: req.params.userid })
  await User.deleteOne({ _id: req.params.userid })

  return res.clearCookie('token').redirect('/admin/alluser')
})

module.exports = adminRouter
