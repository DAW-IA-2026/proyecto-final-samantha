import { PrismaClient } from '@prisma/client'
import { ulid } from 'ulid'

let prisma = null

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()

    prisma.$use(async (params, next) => {
      const modelsWithId = ['User', 'Category', 'Tag', 'Game']
      if (
        params.action === 'create' &&
        modelsWithId.includes(params.model) &&
        params.args.data &&
        !params.args.data.id
      ) {
        params.args.data.id = ulid()
      }
      return next(params)
    })
  }
  return prisma
}

export default getPrisma()
