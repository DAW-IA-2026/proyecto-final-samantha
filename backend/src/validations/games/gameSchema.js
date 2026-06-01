import { z } from 'zod'

export const createGameSchema = z.object({
  name: z.string().min(1, 'Game name is required').max(255),
  category_id: z.string().min(1, 'Category is required'),
  description: z.union([z.string(), z.literal(null), z.literal('')]).optional(),
  cover_image_url: z.union([z.string().url('Invalid URL'), z.literal(null), z.literal('')]).optional(),
  metacritic_score: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Metacritic score must be a number between 0 and 100' }).int().min(0).max(100)
  ),
  hours_to_complete: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Hours to complete must be a positive number' }).positive()
  ),
  tag_ids: z.array(z.string()).optional()
})

export const updateGameSchema = createGameSchema.partial()

export const completeGameSchema = z.object({
  status: z.literal('completed'),
  completion_notes: z.union([z.string(), z.literal(null), z.literal('')]).optional(),
  completion_rating: z.union([
    z.number().int().min(1).max(5),
    z.literal(null)
  ]).optional()
})
