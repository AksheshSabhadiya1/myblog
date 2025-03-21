const { validateToken } = require("../services/auth")


const checkAuthCookie = (cookieValue) => {
  return (req, res, next) => {
    const token = req.cookies[cookieValue]

    if(!token) return next()

    try {
      const payload = validateToken(token)
      req.user = payload
    } catch (error) {
      console.log(error);
    }

    return next()
  }
}


module.exports = { checkAuthCookie }