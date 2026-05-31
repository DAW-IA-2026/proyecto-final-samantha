import prisma from '../db/prisma.js'

export const userRepository = {
  async findByEmail(email) {
    return prisma.user.findFirst({
      where: { email, deleted_at: null }
    })
  },

  async findById(id) {
    return prisma.user.findFirst({
      where: { id, deleted_at: null }
    })
  },

  async create(data) {
    return prisma.user.create({ data })
  },

  async update(id, data) {
    return prisma.user.update({ where: { id }, data })
  }
}
