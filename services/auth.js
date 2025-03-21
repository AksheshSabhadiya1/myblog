const jwt = require('jsonwebtoken')

const secret = "$Akshu@324$#75"


const createTokenForUser = (user) => {
    const payload = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    }

    const token = jwt.sign(payload, secret)
    return token;
}


const validateToken = (token) => {
    const payload = jwt.verify(token, secret)
    return payload
}


module.exports = { createTokenForUser, validateToken }