export const register = async (req, res, next) => {
  try {
    const result = await (await import('../../useCases/auth/index.js')).registerUser(req)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await (await import('../../useCases/auth/index.js')).loginUser(req)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
