const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require('../services/auth')

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["User", "superadmin"],
      default: "User",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isLogin:{
      type: Boolean,
      default: false
    }
  },
  { timestamp: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)                 
                      .update(user.password)
                      .digest("hex");

  this.salt = salt
  this.password = hashPassword
  next()
});


userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({ email })

    if(!user) throw new Error('User Not Found!')

    const salt = user.salt
    const hashPassword = user.password

    const userPassword = createHmac("sha256", salt)
                         .update(password)
                         .digest('hex')
    
    if(hashPassword !== userPassword) throw new Error('Incorrect Email or Password')

    const token = createTokenForUser(user)
    return token
})

const User = model("user", userSchema);

module.exports = User;
