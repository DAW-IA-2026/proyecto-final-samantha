import jwt from 'jsonwebtoken'
import { getPrisma } from '../db/prisma.js'
import { UnauthorizedError, ForbiddenError } from '../errors/index.js'

export const auth = ({ required = true, roles = [] } = {}) => {
  return async (req, res, next) => {
    try {
      const token = req.token

      if (!token) {
        if (required) {
          throw new UnauthorizedError()
        }
        req.userSession = null
        return next()
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const prisma = getPrisma()
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          is_active: true,
          deleted_at: null
        }
      })

      if (!user) {
        if (required) {
          throw new UnauthorizedError()
        }
        req.userSession = null
        return next()
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new ForbiddenError('Admin access required')
      }

      req.userSession = user
      next()
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        throw error
      }
      if (required) {
        throw new UnauthorizedError()
      }
      req.userSession = null
      next()
    }
  }
}
