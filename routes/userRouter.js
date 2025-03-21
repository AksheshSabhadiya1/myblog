const { Router } = require("express");
const { getuserSignup, postuserSignup, getuserSignin, postuserSignin, userLogout, deleteUser} = require('../controllers/user')
const userRouter = Router();
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('./public/profile'))
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({storage: storage})

userRouter.get("/signin", getuserSignin);
userRouter.post("/signin", postuserSignin);

userRouter.get("/signup", getuserSignup);
userRouter.post("/signup", upload.single('profileImage'), postuserSignup);

userRouter.get('/logout', userLogout)

userRouter.get('/delete/:userid', deleteUser)


module.exports = userRouter;
