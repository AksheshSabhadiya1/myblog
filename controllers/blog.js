const Blog = require('../models/blog')
const Comment = require('../models/comment')
const User = require('../models/user')


const getAddBlog = async(req, res)=>{
  const user = await User.findOne({_id: req.user._id})
  return res.render('addBlog', { user: user })
}

const postAddBlog = async(req, res)=>{
  const { title, body } = req.body
  const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
  })
  return res.redirect(`/blog/${blog._id}`)
}

const findBlogById = async(req, res)=>{
  const blog = await Blog.findById(req.params.id).populate('createdBy')
  const allblogs = (await Blog.find({})).filter(item => item.id !== req.params.id)
  const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
  const user = await User.findOne({_id: req.user._id})
  return res.render('blogpage', { user: user, blog, allblogs, comments})
}

const addComment = async(req, res)=>{
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogid,
    createdBy: req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogid}`)
}

const getMyBlog = async(req, res) => {
  const myBlogs = await Blog.find({ createdBy: req.params.userid})
  const user = await User.findOne({_id: req.user._id})
  return res.render('myBlog',{myBlogs: myBlogs, user: user})
}

module.exports = {getAddBlog, postAddBlog, findBlogById, addComment, getMyBlog}