export const gameTransformer = (game) => {
  const priorityScore =
    game.hours_to_complete > 0
      ? Number((game.metacritic_score / Number(game.hours_to_complete)).toFixed(2))
      : 0

  return {
    id: game.id,
    name: game.name,
    description: game.description,
    cover_image_url: game.cover_image_url,
    metacritic_score: game.metacritic_score,
    hours_to_complete: Number(game.hours_to_complete),
    priority_score: priorityScore,
    status: game.status,
    completed_at: game.completed_at,
    completion_notes: game.completion_notes,
    completion_rating: game.completion_rating,
    category: game.category
      ? {
          id: game.category.id,
          name: game.category.name
        }
      : null,
    tags: game.tags
      ? game.tags.map((gt) => ({
          id: gt.tag.id,
          name: gt.tag.name,
          slug: gt.tag.slug
        }))
      : [],
    created_at: game.created_at,
    updated_at: game.updated_at
  }
}
