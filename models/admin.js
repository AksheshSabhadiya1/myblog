const { Schema, model } = require('mongoose')


const adminSchema = new Schema(
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
      enum: ["User", "Admin"],
      default: "Admin",
    },
  },
  { timestamp: true }
);


const Admin = model("superAdmin", adminSchema)


module.exports = Admin