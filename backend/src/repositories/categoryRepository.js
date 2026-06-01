import prisma from '../db/prisma.js'

export const categoryRepository = {
  async findAll({ page = 1, perPage = 100 } = {}) {
    const skip = (page - 1) * perPage

    const [data, count] = await Promise.all([
      prisma.category.findMany({
        where: { deleted_at: null, is_active: true },
        orderBy: { sort_order: 'asc' },
        skip,
        take: perPage
      }),
      prisma.category.count({ where: { deleted_at: null, is_active: true } })
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

  async findById(id) {
    return prisma.category.findFirst({
      where: { id, deleted_at: null, is_active: true }
    })
  },

  async create(data) {
    return prisma.category.create({ data })
  },

  async update(id, data) {
    return prisma.category.update({ where: { id }, data })
  },

  async delete(id) {
    return prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }
}
