import { AppError, ValidationError } from '../errors/index.js'

export const errorHandler = (err, req, res, next) => {
  // Only log real errors (5xx) or unexpected errors, not controlled HTTP errors like 404
  if (!err.statusCode || err.statusCode >= 500 || !(err instanceof AppError)) {
    console.error(err)
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    })
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON in request body'
    })
  }

  return res.status(500).json({
    message: 'An unexpected error occurred'
  })
}
