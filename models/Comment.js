import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})


export default mongoose.model('Comment', CommentSchema)