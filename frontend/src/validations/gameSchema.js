import { z } from 'zod'

const refineUrl = (val) => {
  if (val === null || val === '' || val === undefined) return true
  try {
    new URL(val)
    return true
  } catch {
    return false
  }
}

export const createGameSchema = z.object({
  name: z.string().min(1, 'Game name is required').max(255),
  category_id: z.string().min(1, 'Category is required'),
  description: z.union([z.string(), z.literal(null), z.literal('')]).optional(),
  cover_image_url: z.string().refine(refineUrl, { message: 'Invalid URL' }).optional().or(z.literal(null)).or(z.literal('')),
  metacritic_score: z.number({ invalid_type_error: 'Metacritic score must be a number between 0 and 100' })
    .int()
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must be at most 100'),
  hours_to_complete: z.number({ invalid_type_error: 'Hours to complete must be a positive number' })
    .positive('Hours must be greater than 0'),
  tag_ids: z.array(z.string()).optional()
})
