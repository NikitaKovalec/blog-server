import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import {registerValidation, loginValidation} from './validations/auth.js'
import {postValidation} from './validations/post.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controllers/index.js'

mongoose.connect('mongodb+srv://admin:a9092332Aa@cluster0.zw7ba1s.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err))

const PORT = 4000
const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

app.use(cors())
app.use(express.json())
app.use('/upload', express.static('uploads'))


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/upload/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getLastTags)
app.get('/tags/:tag', PostController.getOneTag)

app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getPopular)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postValidation, handleValidationErrors, PostController.update)

app.get('/posts/:id/comments', CommentController.getAll)
app.post('/posts/:id/comments', checkAuth, CommentController.create)
app.delete('/posts/:id/comments/:commId', checkAuth, CommentController.remove)


app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server run on port: ', PORT)
})