const { Schema, model } = require('mongoose')


const superadminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/images/profile_avatar.png",
    },
    blogId: [{
      type: Schema.Types.ObjectId,
      ref: 'blog'
    }],
    createdBy: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],    
    role: {
      type: String,
      enum: ["Superadmin"],
      default: "Superadmin",
    },
  },
  { timestamp: true }
);


const Superadmin = model("supersuperadmin", superadminSchema)


module.exports = Superadmin