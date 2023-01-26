import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import {registerValidation, loginValidation} from './validations/auth.js'
import {postValidation} from './validations/post.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controllers/index.js'

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err))

const PORT = 4000
const app = express()

// import http from 'http';
// const server = http.createServer(app)
// import {Server} from 'socket.io';
// const io = new Server(server, {
//   cors: {
//     origin: [process.env.CLIENT_URL],
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });
//
// io.on('connection', (socket) => {
//   socket.on('send-message', (data) => {
//     io.emit('new-message', data);
//   });
// });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
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


app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server run')
})