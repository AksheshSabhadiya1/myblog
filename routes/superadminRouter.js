const express = require('express')
const superadminRouter = express.Router()
<<<<<<< HEAD
const { getsuperadmin, getAlluser, getAllblog, getApproved, deleteUser} = require('../controllers/superadmin')


superadminRouter.get('/', getsuperadmin)

superadminRouter.get('/alluser', getAlluser)

superadminRouter.get('/allblog', getAllblog)

superadminRouter.get('/isapproved/:userid', getApproved)

superadminRouter.get('/delete/:userid', deleteUser)

=======
const SuperAdmin = require('../models/superadmin')
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment')


superadminRouter.get('/', async(req, res, next)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const allusers = await User.find({})
  const allblogs = await Blog.find({})
  const allComment = await Comment.find({})

  if(superadmindata === null){
    console.log("true");
      await SuperAdmin.create({
        fullName: 'superadmin',
        email: 'superadmin@gmail.com',
        blogId: allblogs,
        createdBy: allusers,
    })
  }else {
    await SuperAdmin.findOneAndUpdate(superadmindata._id, { createdBy: allusers, blogId: allblogs} )
  }

  return res.render("superadminpage", {superadmin: superadmindata, allusers, allblogs, allComment});
})

superadminRouter.get('/alluser', async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const alluser = await User.find({})

  return res.render("alluser", {superadmin: superadmindata, alluser: alluser});
} )

superadminRouter.get('/allblog', async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const allblog = await Blog.find({})
  const alluser = await User.find({})
  const allComment = await Comment.find({})

  return res.render("allblog", {superadmin: superadmindata, allblog: allblog, alluser: alluser, allComment: allComment});
} )

superadminRouter.get('/isapproved/:userid', async(req, res)=>{
  const user = await User.findById(req.params.userid)
  await User.findByIdAndUpdate(req.params.userid, {isApproved: !user.isApproved})

  return res.redirect('/superadmin/alluser')
})

superadminRouter.get('/delete/:userid', async(req, res)=>{
  await Blog.deleteMany({ createdBy: req.params.userid })
  await Comment.deleteMany({ createdBy: req.params.userid })
  await User.deleteOne({ _id: req.params.userid })

  return res.clearCookie('token').redirect('/superadmin/alluser')
})
>>>>>>> d43ff9a6721140720cc03a379d613365563be951

module.exports = superadminRouter
