import { z } from 'zod'

export const validate = (schema, data) => {
  const result = schema.safeParse(data)
  if (!result.success) {
    return result.error.errors.map((err) => ({
      path: err.path,
      message: err.message
    }))
  }
  return null
}
