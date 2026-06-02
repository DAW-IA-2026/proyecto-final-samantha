import prisma from '../db/prisma.js'

const buildWhere = (filters = {}, userId = null) => {
  const where = { deleted_at: null }

  if (userId) {
    where.user_id = userId
  }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.category_id) {
    where.category_id = filters.category_id
  }

  if (filters.search) {
    where.name = { contains: filters.search }
  }

  if (filters.tag) {
    where.tags = {
      some: {
        tag: {
          slug: filters.tag,
          deleted_at: null
        }
      }
    }
  }

  return where
}

const buildOrderBy = (sort = 'priority') => {
  switch (sort) {
    case 'score':
      return { metacritic_score: 'desc' }
    case 'hours':
      return { hours_to_complete: 'asc' }
    case 'status':
      return { status: 'asc' }
    case 'priority':
    default:
      return { metacritic_score: 'asc' }
  }
}

export const gameRepository = {
  async findAll({ page = 1, perPage = 10, sort, ...filters }, userId = null) {
    const skip = (page - 1) * perPage
    const where = buildWhere(filters, userId)
    const orderBy = buildOrderBy(sort)

    const [data, count] = await Promise.all([
      prisma.game.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          category: true,
          tags: {
            include: { tag: true }
          }
        }
      }),
      prisma.game.count({ where })
    ])

    return {
      data,
      meta: {
        pagination: {
          current_page: page,
          per_page: perPage,
          total_pages: Math.ceil(count / perPage),
          total_items: count
        }
      }
    }
  },

  async findById(id, userId = null) {
    const where = { id, deleted_at: null }
    if (userId) where.user_id = userId

    return prisma.game.findFirst({
      where,
      include: {
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    })
  },

  async create(data) {
    const { tag_ids, ...gameData } = data
    return prisma.game.create({
      data: {
        ...gameData,
        tags: tag_ids?.length
          ? {
              create: tag_ids.map((tagId) => ({
                tag: { connect: { id: tagId } }
              }))
            }
          : undefined
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    })
  },

  async update(id, data) {
    const { tag_ids, ...gameData } = data

    if (tag_ids !== undefined) {
      await prisma.gameTag.deleteMany({ where: { game_id: id } })
    }

    return prisma.game.update({
      where: { id },
      data: {
        ...gameData,
        tags: tag_ids?.length
          ? {
              create: tag_ids.map((tagId) => ({
                tag: { connect: { id: tagId } }
              }))
            }
          : tag_ids !== undefined
            ? { create: [] }
            : undefined
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    })
  },

  async delete(id) {
    return prisma.game.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }
}
