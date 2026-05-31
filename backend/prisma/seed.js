import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Default user for Sprint 1
  const defaultUser = await prisma.user.upsert({
    where: { email: 'default@game.app' },
    update: {},
    create: {
      id: '01DEFAULTUSER000',
      alias: 'GamerDefault',
      email: 'default@game.app',
      password: '$2a$10$hashed_password_placeholder', // Not used in Sprint 1
      role: 'user',
      is_active: true
    }
  })

  // Admin user
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

  // Categories
  const categories = [
    { name: 'RPG', sort_order: 1 },
    { name: 'Shooter', sort_order: 2 },
    { name: 'Indie', sort_order: 3 },
    { name: 'Strategy', sort_order: 4 },
    { name: 'Adventure', sort_order: 5 },
    { name: 'Roguelike', sort_order: 6 },
    { name: 'Platformer', sort_order: 7 },
    { name: 'Puzzle', sort_order: 8 }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    })
  }

  // Tags
  const tags = [
    { name: 'Action', slug: 'action' },
    { name: 'Zombies', slug: 'zombies' },
    { name: 'Story Rich', slug: 'story-rich' },
    { name: 'Multiplayer', slug: 'multiplayer' },
    { name: 'Co-op', slug: 'co-op' },
    { name: 'Retro', slug: 'retro' },
    { name: 'Pixel Art', slug: 'pixel-art' },
    { name: 'Open World', slug: 'open-world' },
    { name: 'Difficult', slug: 'difficult' },
    { name: 'Relaxing', slug: 'relaxing' }
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

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
