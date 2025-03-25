const express = require('express')
const superadminRouter = express.Router()
const { getsuperadmin, getAlluser, getAllblog, getApproved, deleteUser} = require('../controllers/superadmin')


superadminRouter.get('/', getsuperadmin)

superadminRouter.get('/alluser', getAlluser)

superadminRouter.get('/allblog', getAllblog)

superadminRouter.get('/isapproved/:userid', getApproved)

superadminRouter.get('/delete/:userid', deleteUser)


module.exports = superadminRouter
