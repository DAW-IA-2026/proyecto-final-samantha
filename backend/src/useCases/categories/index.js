import { categoryRepository } from '../../repositories/categoryRepository.js'
import { validate } from '../../utils/validate.js'
import { ValidationError, NotFoundError } from '../../errors/index.js'
import {
  createCategorySchema,
  updateCategorySchema
} from '../../validations/categories/categorySchema.js'

export const listCategories = async () => {
  return categoryRepository.findAll()
}

export const getCategory = async (req) => {
  const { id } = req.params
  const category = await categoryRepository.findById(id)
  if (!category) throw new NotFoundError('Category')
  return { data: category }
}

export const createCategory = async (req) => {
  const errors = validate(createCategorySchema, req.body)
  if (errors) throw new ValidationError(errors)

  const category = await categoryRepository.create(req.body)
  return { data: category }
}

export const updateCategory = async (req) => {
  const { id } = req.params
  const errors = validate(updateCategorySchema, req.body)
  if (errors) throw new ValidationError(errors)

  const existing = await categoryRepository.findById(id)
  if (!existing) throw new NotFoundError('Category')

  const category = await categoryRepository.update(id, req.body)
  return { data: category }
}

export const deleteCategory = async (req) => {
  const { id } = req.params
  const existing = await categoryRepository.findById(id)
  if (!existing) throw new NotFoundError('Category')

  await categoryRepository.delete(id)
  return { data: existing }
}
