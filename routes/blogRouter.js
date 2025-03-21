const { Router } = require("express");
const {getAddBlog, postAddBlog, findBlogById, addComment, getMyBlog} = require('../controllers/blog')
const blogRouter = Router();
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({storage: storage})

blogRouter.get('/addBlog', getAddBlog)
blogRouter.post('/', upload.single("coverImageURL"), postAddBlog)

blogRouter.get('/:id', findBlogById)
blogRouter.post('/comment/:blogid', addComment)

blogRouter.get('/myBlog/:userid', getMyBlog)


module.exports = blogRouter;
