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

  // Fetch category IDs for seeding games
  const categories = await prisma.category.findMany({ where: { deleted_at: null } })
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]))

  // ── Tags ──
  const tagsData = [
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

  for (const tag of tagsData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

  // Fetch tag IDs for seeding games
  const tags = await prisma.tag.findMany({ where: { deleted_at: null } })
  const tagMap = Object.fromEntries(tags.map(t => [t.slug, t.id]))

  // ── Demo Games ──
  const gamesSeed = [
    {
      name: 'Hades',
      category: 'Roguelike',
      description: 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
      metacritic_score: 93,
      hours_to_complete: 25.5,
      status: 'pending',
      tagSlugs: ['action', 'difficult', 'story-rich']
    },
    {
      name: 'Elden Ring',
      category: 'RPG',
      description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
      metacritic_score: 96,
      hours_to_complete: 60.0,
      status: 'pending',
      tagSlugs: ['open-world', 'difficult', 'story-rich']
    },
    {
      name: 'Celeste',
      category: 'Platformer',
      description: 'Help Madeline survive her inner demons on her journey to the top of Celeste Mountain.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png',
      metacritic_score: 94,
      hours_to_complete: 12.0,
      status: 'completed',
      completed_at: new Date('2024-03-15'),
      completion_notes: 'Absolutely perfect. The soundtrack is incredible and the story hit hard. Farewell chapter was brutal but worth it.',
      completion_rating: 5,
      tagSlugs: ['pixel-art', 'difficult', 'story-rich']
    },
    {
      name: 'Hollow Knight',
      category: 'Adventure',
      description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Hollow_Knight_cover.jpg',
      metacritic_score: 90,
      hours_to_complete: 30.0,
      status: 'completed',
      completed_at: new Date('2024-01-20'),
      completion_notes: 'One of the best Metroidvanias ever made. The atmosphere is unmatched. Grimm Troupe DLC was amazing.',
      completion_rating: 5,
      tagSlugs: ['action', 'difficult', 'story-rich']
    },
    {
      name: 'Stardew Valley',
      category: 'Indie',
      description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools, can you learn to live off the land?',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/3/34/Stardew_Valley_logo.png',
      metacritic_score: 89,
      hours_to_complete: 52.5,
      status: 'pending',
      tagSlugs: ['relaxing', 'pixel-art', 'co-op']
    },
    {
      name: 'Hades II',
      category: 'Roguelike',
      description: 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Hades_II_cover.jpg',
      metacritic_score: 91,
      hours_to_complete: 20.0,
      status: 'pending',
      tagSlugs: ['action', 'difficult']
    },
    {
      name: 'Portal 2',
      category: 'Puzzle',
      description: 'The "Perpetual Testing Initiative" has been expanded to allow you to design co-op puzzles for you and your friends.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Portal2cover.jpg',
      metacritic_score: 95,
      hours_to_complete: 10.5,
      status: 'completed',
      completed_at: new Date('2023-11-08'),
      completion_notes: 'Wheatley is the best villain. Co-op mode with a friend was hilarious. The ending song still lives rent-free in my head.',
      completion_rating: 5,
      tagSlugs: ['co-op', 'story-rich']
    },
    {
      name: 'The Witcher 3: Wild Hunt',
      category: 'RPG',
      description: 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
      metacritic_score: 93,
      hours_to_complete: 51.5,
      status: 'pending',
      tagSlugs: ['open-world', 'story-rich', 'action']
    },
    {
      name: 'Hollow Knight: Silksong',
      category: 'Adventure',
      description: 'Play as Hornet, princess-protector of Hallownest, and adventure through a whole new kingdom ruled by silk and song.',
      cover_image_url: null,
      metacritic_score: 88,
      hours_to_complete: 25.0,
      status: 'pending',
      tagSlugs: ['action', 'difficult']
    },
    {
      name: 'Vampire Survivors',
      category: 'Indie',
      description: 'Mow down thousands of night creatures and survive until dawn! Vampire Survivors is a gothic horror casual game with rogue-lite elements.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/1/12/Vampire_Survivors_cover.jpg',
      metacritic_score: 87,
      hours_to_complete: 15.0,
      status: 'completed',
      completed_at: new Date('2024-05-01'),
      completion_notes: 'Surprisingly addictive. Simple concept but incredibly satisfying power progression. Perfect for short sessions.',
      completion_rating: 4,
      tagSlugs: ['action', 'retro']
    },
    {
      name: 'Factorio',
      category: 'Strategy',
      description: 'A game in which you build and maintain factories. You will be mining resources, researching technologies, building infrastructure, and fighting enemies.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Factorio_logo.png',
      metacritic_score: 91,
      hours_to_complete: 80.0,
      status: 'pending',
      tagSlugs: ['multiplayer', 'co-op', 'difficult']
    },
    {
      name: 'A Short Hike',
      category: 'Adventure',
      description: 'Hike, climb, and soar through the peaceful mountainside landscapes of Hawk Peak Provincial Park.',
      cover_image_url: 'https://upload.wikimedia.org/wikipedia/en/2/2e/A_Short_Hike_cover.png',
      metacritic_score: 88,
      hours_to_complete: 1.5,
      status: 'completed',
      completed_at: new Date('2024-02-14'),
      completion_notes: 'Short but incredibly charming. Felt like a warm hug. The flying mechanics are so satisfying.',
      completion_rating: 5,
      tagSlugs: ['relaxing', 'pixel-art']
    }
  ]

  for (const gameData of gamesSeed) {
    const { tagSlugs, category, ...rest } = gameData
    const categoryId = catMap[category]
    const tagIds = tagSlugs.map(slug => tagMap[slug]).filter(Boolean)

    const existing = await prisma.game.findFirst({
      where: { name: rest.name, deleted_at: null }
    })

    if (!existing) {
      await prisma.game.create({
        data: {
          ...rest,
          user_id: defaultUser.id,
          category_id: categoryId,
          tags: {
            create: tagIds.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        }
      })
      console.log(`  Created game: ${rest.name}`)
    } else {
      console.log(`  Game already exists: ${rest.name}`)
    }
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
