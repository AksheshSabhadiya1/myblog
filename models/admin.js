const { Schema, model } = require('mongoose')
const { randomBytes, createHmac } = require('crypto')
const {createTokenForAdmin} = require('../services/auth')

const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String
    },
    profileImage: {
      type: String,
      default: "/images/profile_avatar.png",
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamp: true }
);

adminSchema.pre('save', function (next){
  const admin = this

  if(!admin.isModified('password')) return

  const salt = randomBytes(16).toString()
  const hashPassword = createHmac('sha256', salt)
                      .update(admin.password)
                      .digest('hex')

  this.salt = salt
  this.password = hashPassword
  next()
})


adminSchema.static('matchPasswordAndGenerateTokenForAdmin', async function (email, password){
  const admin = await this.findOne({email})

  if(!admin) throw new Error('Admin Not Found!')

  const salt = admin.salt
  const hashPassword = admin.password

  const adminPassword = createHmac('sha256', salt)
                        .update(password)
                        .digest('hex')

  if(hashPassword !== adminPassword) throw new Error('Incorrect Email or Password')

  const admintoken = createTokenForAdmin(admin)
  return admintoken
})

const Admin = model("admin", adminSchema)


module.exports = Admin