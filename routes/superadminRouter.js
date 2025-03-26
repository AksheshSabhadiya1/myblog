const express = require('express')
const superadminRouter = express.Router()
const { getsuperadmin, getAllApprovedUser, getAllNotApprovedUser, getAllblog, getAllApprovedAdmin, getAllNotApprovedAdmin, getApprovedUser, postassignAdmin, getApprovedAdmin, deleteUser} = require('../controllers/superadmin')
const SuperAdmin = require('../models/superadmin')
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Admin = require('../models/admin');

superadminRouter.get('/', getsuperadmin)

superadminRouter.get('/allblog', getAllblog)
superadminRouter.get('/allApprovedAdmin', getAllApprovedAdmin)
superadminRouter.get('/allNotApprovedAdmin', getAllNotApprovedAdmin)

superadminRouter.get('/allApprovedUser', getAllApprovedUser)
superadminRouter.get('/allNotApprovedUser', getAllNotApprovedUser)

superadminRouter.get('/approvedUser/:userid', getApprovedUser)
superadminRouter.post('/assignAdmin', postassignAdmin)
superadminRouter.get('/approvedAdmin/:adminid', getApprovedAdmin)

superadminRouter.get('/delete/:userid', deleteUser)


module.exports = superadminRouter
