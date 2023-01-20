import { body } from'express-validator'

export const postValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 5 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]