export const userTransformer = (user) => ({
  id: user.id,
  alias: user.alias,
  email: user.email,
  role: user.role,
  is_active: user.is_active,
  created_at: user.created_at,
  updated_at: user.updated_at
})
