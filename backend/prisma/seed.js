import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Users ──
  const defaultUser = await prisma.user.upsert({
    where: { email: 'default@game.app' },
    update: {},
    create: {
      id: '01DEFAULTUSER000',
      alias: 'GamerDefault',
      email: 'default@game.app',
      password: '$2a$10$hashed_password_placeholder',
      role: 'user',
      is_active: true
    }
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@game.app' },
    update: {},
    create: {
      id: '01ADMINUSER00000',
      alias: 'AdminBoss',
      email: 'admin@game.app',
      password: '$2a$10$hashed_password_placeholder',
      role: 'admin',
      is_active: true
    }
  })

  // ── Categories ──
  const categoriesData = [
    { name: 'RPG', sort_order: 1 },
    { name: 'Shooter', sort_order: 2 },
    { name: 'Indie', sort_order: 3 },
    { name: 'Strategy', sort_order: 4 },
    { name: 'Adventure', sort_order: 5 },
    { name: 'Roguelike', sort_order: 6 },
    { name: 'Platformer', sort_order: 7 },
    { name: 'Puzzle', sort_order: 8 }
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    })
  }

  // No demo games — clean slate for users to populate via ext-finder

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
