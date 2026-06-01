import prisma from '../db/prisma.js'

export const tagRepository = {
  async findAll({ page = 1, perPage = 100 } = {}) {
    const skip = (page - 1) * perPage

    const [data, count] = await Promise.all([
      prisma.tag.findMany({
        where: { deleted_at: null },
        orderBy: { name: 'asc' },
        skip,
        take: perPage
      }),
      prisma.tag.count({ where: { deleted_at: null } })
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
    return prisma.tag.findFirst({
      where: { id, deleted_at: null }
    })
  },

  async findBySlug(slug) {
    return prisma.tag.findFirst({
      where: { slug, deleted_at: null }
    })
  },

  async findBySlug(slug) {
    return prisma.tag.findFirst({
      where: { slug, deleted_at: null }
    })
  },

  async create(data) {
    return prisma.tag.create({ data })
  },

  async update(id, data) {
    return prisma.tag.update({ where: { id }, data })
  },

  async delete(id) {
    return prisma.tag.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }
}
