import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { userRepository } from '../../repositories/userRepository.js'
import { NotFoundError, ValidationError } from '../../errors/index.js'
import { validate } from '../../utils/validate.js'

const updateMeSchema = z.object({
  alias: z.string().min(2, 'Alias is too short').max(100).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
}).refine((data) => data.alias || data.password, {
  message: 'At least one field (alias or password) must be provided'
})

export const getMe = async (req) => {
  const user = await userRepository.findById(req.userSession.id)
  if (!user) throw new NotFoundError('User')
  return { data: user }
}

export const updateMe = async (req) => {
  const errors = validate(updateMeSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const { alias, password } = req.body
  const data = {}

  if (alias) data.alias = alias
  if (password) data.password = await bcrypt.hash(password, 10)

  const user = await userRepository.update(req.userSession.id, data)
  return { data: user }
}
