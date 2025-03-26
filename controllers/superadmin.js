const SuperAdmin = require('../models/superadmin')
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Admin = require('../models/admin');

const getsuperadmin = async(req, res, next)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const allusers = await User.find({})
  const allblogs = await Blog.find({})
  const allComment = await Comment.find({})

  if(superadmindata === null){
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
}


const getAllApprovedUser = async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const alladmin = await Admin.find({},{fullName:1, email:1})
  const alluser = await User.find({isApproved: true})

  return res.render("alluser", {superadmin: superadmindata, alluser, alladmin});
}

const getAllNotApprovedUser = async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const alladmin = await Admin.find({})
  const alluser = await User.find({isApproved: false})

  return res.render("alluser", {superadmin: superadmindata, alluser, alladmin});
}

const getAllblog = async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const allblog = await Blog.find({})
  const alluser = await User.find({})
  const allComment = await Comment.find({})

  return res.render("allblog", {superadmin: superadmindata, allblog, alluser, allComment});
} 

const getAllApprovedAdmin = async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const alladmin = await Admin.find({isApproved: true})

  return res.render("alladmin", {superadmin: superadmindata, alladmin});
}

const getAllNotApprovedAdmin = async(req, res)=>{
  const superadmindata = await SuperAdmin.findOne({})
  const alladmin = await Admin.find({isApproved: false})

  return res.render("alladmin", {superadmin: superadmindata, alladmin});
}

const getApprovedUser = async(req, res)=>{
  const user = await User.findById(req.params.userid)
  await User.findByIdAndUpdate(req.params.userid, {isApproved: !user.isApproved})

  return res.redirect('/superadmin/allApprovedUser')
}

const postassignAdmin = async(req, res) => {
  const {adminname, adminemail, useremail} = req.body
  const admin = await Admin.findOne({fullName: adminname, email: adminemail})

  if(!admin) return res.render('alluser',{error: "Admin not Found"})

  const user = await User.findOneAndUpdate({email: useremail}, {adminId: admin._id})
  

  return res.redirect('/superadmin/allNotApprovedUser')
}

const getApprovedAdmin = async(req, res)=>{
  const admin = await Admin.findById(req.params.adminid)
  const updateadmin = await Admin.findByIdAndUpdate(req.params.adminid, {isApproved: !admin.isApproved})
  if(updateadmin.isApproved !== true){
    return res.redirect('/superadmin/allApprovedAdmin')
  } else {
    return res.redirect('/superadmin/allNotApprovedAdmin')
  }
}

const deleteUser = async(req, res)=>{
  await Blog.deleteMany({ createdBy: req.params.userid })
  await Comment.deleteMany({ createdBy: req.params.userid })
  await User.deleteOne({ _id: req.params.userid })

  return res.clearCookie('token').redirect('/superadmin/alluser')
}


module.exports = {getsuperadmin, getAllApprovedUser, getAllNotApprovedUser, getAllblog, getAllApprovedAdmin, getAllNotApprovedAdmin, getApprovedUser, postassignAdmin, getApprovedAdmin, deleteUser}