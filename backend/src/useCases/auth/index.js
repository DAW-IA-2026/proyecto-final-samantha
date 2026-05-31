import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userRepository } from '../../repositories/userRepository.js'
import { validate } from '../../utils/validate.js'
import { ValidationError, ConflictError, UnauthorizedError } from '../../errors/index.js'
import { registerSchema, loginSchema } from '../../validations/auth/authSchema.js'

export const registerUser = async (req) => {
  const errors = validate(registerSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const { alias, email, password } = req.body

  const existing = await userRepository.findByEmail(email)
  if (existing) {
    throw new ConflictError('A user with this email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userRepository.create({
    alias,
    email,
    password: hashedPassword,
    role: 'user'
  })

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return {
    data: {
      id: user.id,
      alias: user.alias,
      email: user.email,
      role: user.role,
      token,
      created_at: user.created_at
    }
  }
}

export const loginUser = async (req) => {
  const errors = validate(loginSchema, req.body)
  if (errors) throw new ValidationError(errors)

  const { email, password } = req.body

  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return {
    data: {
      id: user.id,
      alias: user.alias,
      email: user.email,
      role: user.role,
      token
    }
  }
}
