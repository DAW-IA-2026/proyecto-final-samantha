import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional()
})

export const updateCategorySchema = createCategorySchema.partial()
