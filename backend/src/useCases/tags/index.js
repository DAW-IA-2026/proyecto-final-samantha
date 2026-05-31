import { tagRepository } from '../../repositories/tagRepository.js'
import slugify from '../../utils/slugify.js'
import { validate } from '../../utils/validate.js'
import { ValidationError, NotFoundError, ConflictError } from '../../errors/index.js'
import {
  createTagSchema,
  updateTagSchema
} from '../../validations/tags/tagSchema.js'

export const listTags = async () => {
  return tagRepository.findAll()
}

export const getTag = async (req) => {
  const { id } = req.params
  const tag = await tagRepository.findById(id)
  if (!tag) throw new NotFoundError('Tag')
  return { data: tag }
}

export const createTag = async (req) => {
  const errors = validate(createTagSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const slug = slugify(req.body.name)
  const existing = await tagRepository.findBySlug?.(slug)
  // We'll check in controller or handle gracefully

  const tag = await tagRepository.create({
    name: req.body.name,
    slug
  })
  return { data: tag }
}

export const updateTag = async (req) => {
  const { id } = req.params
  const errors = validate(updateTagSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const existing = await tagRepository.findById(id)
  if (!existing) throw new NotFoundError('Tag')

  const data = { ...req.body }
  if (data.name) {
    data.slug = slugify(data.name)
  }

  const tag = await tagRepository.update(id, data)
  return { data: tag }
}

export const deleteTag = async (req) => {
  const { id } = req.params
  const existing = await tagRepository.findById(id)
  if (!existing) throw new NotFoundError('Tag')

  await tagRepository.delete(id)
  return { data: existing }
}
