import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

    res.json(tags)
  } catch (e) {
    console.log('Не удалось получить список статей', e)
    res.status(500).json({
      message: 'Не удалось получить список статей'
    })
  }
}

export const getOneTag = async (req, res) => {
  try {
    const tagName = req.params.tag

    const posts = await PostModel.find({tags: tagName}).exec()

    res.json(posts)
  } catch (e) {
    console.log('Не удалось получить список статей', e)
    res.status(500).json({
      message: 'Не удалось получить список статей'
    })
  }
}
export const getPopular = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({viewsCount: -1})

    res.json(posts)
  } catch (e) {
    console.log('Не удалось получить список популярных статей', e)
    res.status(500).json({
      message: 'Не удалось получить список популярных статей'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({createdAt: -1}).populate('user').exec()

    res.json(posts)
  } catch (e) {
    console.log('Не удалось получить список статей', e)
    res.status(500).json({
      message: 'Не удалось получить список статей'
    })
  }
}
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after'
      },
      (e, doc) => {
        if (e) {
          console.log('Не удалось вернуть статью', e)
          return res.status(500).json({
            message: 'Не удалось вернуть статью'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }
        res.json(doc)
      }
    ).populate('user')
  } catch (e) {
    console.log('Не удалось получить список статей', e)
    res.status(500).json({
      message: 'Не удалось получить список статей'
    })
  }
}
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (e) {
    console.log('Не удалось создать статью', e)
    res.status(500).json({
      message: 'Не удалось создать статью'
    })
  }
}
export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete(
      {
        _id: postId
      },
      (e, doc) => {
        if (e) {
          console.log('Не удалось удалить статью', e)
          return res.status(500).json({
            message: 'Не удалось удалить статью'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }

        res.json({
          success: true,
        })
      }
    )

  } catch (e) {
    console.log('Не удалось получить список статей', e)
    res.status(500).json({
      message: 'Не удалось получить список статей'
    })
  }
}
export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    )

    res.json({
      success: true,
    })

  } catch (e) {
    console.log('Не удалось обновить статью', e)
    res.status(500).json({
      message: 'Не удалось обновить статью'
    })
  }
}

