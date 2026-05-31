export const tagTransformer = (tag) => ({
  id: tag.id,
  name: tag.name,
  slug: tag.slug,
  created_at: tag.created_at,
  updated_at: tag.updated_at
})
