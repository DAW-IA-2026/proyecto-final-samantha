import bcrypt from 'bcryptjs'
import { userRepository } from '../../repositories/userRepository.js'
import { NotFoundError } from '../../errors/index.js'

export const getMe = async (req) => {
  const user = await userRepository.findById(req.userSession.id)
  if (!user) throw new NotFoundError('User')
  return { data: user }
}

export const updateMe = async (req) => {
  const { alias, password } = req.body
  const data = {}

  if (alias) data.alias = alias
  if (password) data.password = await bcrypt.hash(password, 10)

  const user = await userRepository.update(req.userSession.id, data)
  return { data: user }
}
