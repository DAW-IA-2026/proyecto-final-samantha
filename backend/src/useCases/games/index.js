import { z } from 'zod'
import { gameRepository } from '../../repositories/gameRepository.js'
import { validate } from '../../utils/validate.js'
import { ValidationError, NotFoundError, ForbiddenError } from '../../errors/index.js'
import {
  createGameSchema,
  updateGameSchema,
  completeGameSchema
} from '../../validations/games/gameSchema.js'

export const listGames = async (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const perPage = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 10))
  const sort = req.query.sort || 'priority'
  const status = req.query.status || undefined
  const category_id = req.query.category_id || undefined
  const tag = req.query.tag || undefined
  const search = req.query.search || undefined

  const userId = req.userSession.id

  return gameRepository.findAll(
    { page, perPage, sort, status, category_id, tag, search },
    userId
  )
}

export const getGame = async (req) => {
  const { id } = req.params
  const userId = req.userSession.id

  const game = await gameRepository.findById(id, userId)
  if (!game) throw new NotFoundError('Game')

  return { data: game }
}

export const createGame = async (req) => {
  const errors = validate(createGameSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const userId = req.userSession.id
  const data = { ...req.body, user_id: userId }

  const game = await gameRepository.create(data)
  return { data: game }
}

export const updateGame = async (req) => {
  const { id } = req.params
  const errors = validate(updateGameSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const userId = req.userSession.id
  const existing = await gameRepository.findById(id, userId)
  if (!existing) throw new NotFoundError('Game')

  const game = await gameRepository.update(id, req.body)
  return { data: game }
}

export const deleteGame = async (req) => {
  const { id } = req.params
  const userId = req.userSession.id

  const existing = await gameRepository.findById(id, userId)
  if (!existing) throw new NotFoundError('Game')

  const game = await gameRepository.delete(id)
  return { data: game }
}

export const completeGame = async (req) => {
  const { id } = req.params
  const errors = validate(completeGameSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const userId = req.userSession.id
  const existing = await gameRepository.findById(id, userId)
  if (!existing) throw new NotFoundError('Game')

  const game = await gameRepository.update(id, {
    status: 'completed',
    completed_at: new Date(),
    completion_notes: req.body.completion_notes || null,
    completion_rating: req.body.completion_rating || null
  })

  return { data: game }
}
