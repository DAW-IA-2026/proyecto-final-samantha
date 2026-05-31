export const categoryTransformer = (category) => ({
  id: category.id,
  name: category.name,
  sort_order: category.sort_order,
  is_active: category.is_active,
  created_at: category.created_at,
  updated_at: category.updated_at
})
