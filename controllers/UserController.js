import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatar: req.body.avatar,
    })

    const user = await doc.save()

    const token = jwt.sign({
        _id: user._id
      },
      'secret42',
      {
        expiresIn: '30d'
      }
    )

    const {passwordHash, ...userData} = user._doc

    res.json({...userData, token})
  } catch (e) {
    console.log('Не удалось зарегистрировать пользователя', e)
    res.status(500).json({
      message: 'Не удалось зарегистрировать пользователя'
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email})

    if (!user) {
      return res.status(400).json({
        message: 'Неверный логин или пароль'
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль'
      })
    }

    const token = jwt.sign({
        _id: user._id
      },
      'secret42',
      {
        expiresIn: '30d'
      }
    )

    const {passwordHash, ...userData} = user._doc

    res.json({...userData, token})

  } catch (e) {
    console.log('Не удалось авторизоваться', e)
    res.status(500).json({
      message: 'Не удалось авторизоваться'
    })
  }
}

export const authMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    const {passwordHash, ...userData} = user._doc

    res.json(userData)

  } catch (e) {
    console.log('Нет доступа', e)
    res.status(500).json({
      message: 'Нет доступа'
    })
  }
}