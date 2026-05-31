import { z } from 'zod'

export const createGameSchema = z.object({
  name: z.string().min(1, 'Game name is required').max(255),
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().optional().or(z.literal('')),
  cover_image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  metacritic_score: z.number().int().min(0).max(100),
  hours_to_complete: z.number().positive(),
  tag_ids: z.array(z.string()).optional()
})

export const updateGameSchema = createGameSchema.partial()

export const completeGameSchema = z.object({
  status: z.literal('completed'),
  completion_notes: z.string().optional().or(z.literal('')),
  completion_rating: z.number().int().min(1).max(5).optional()
})
