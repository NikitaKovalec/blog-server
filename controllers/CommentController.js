import CommentModel from "../models/Comment.js";

export const getAll = async (req, res) => {
  const post = req.params.id

  try {
    const comments = await CommentModel.find({post}).sort({createdAt: -1}).populate('post').exec()

    res.json(comments)
  } catch (e) {
    console.log('Не удалось получить список комментариев', e)
    res.status(500).json({
      message: 'Не удалось получить список комментариев'
    })
  }
}

export const create = async (req, res) => {

  try {
    const doc = new CommentModel({
      user: req.userId,
      post: req.params.id,
      content: req.body.content,
    })

    const comment = await doc.save()

    res.json(comment)
  } catch (e) {
    console.log('Не удалось создать комментарий', e)
    res.status(500).json({
      message: 'Не удалось создать комментарий'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const commId = req.params.commId

    CommentModel.findOneAndDelete(
      {
        _id: commId
      },
      (e, doc) => {
        if (e) {
          console.log('Не удалось удалить комментарий', e)
          return res.status(500).json({
            message: 'Не удалось удалить комментарий'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Комментарий не найден'
          })
        }

        res.json({
          success: true,
        })
      }
    )
  } catch (e) {
    console.log('Не удалось удалить комментарий', e)
    res.status(500).json({
      message: 'Не удалось удалить комментарий'
    })
  }
}