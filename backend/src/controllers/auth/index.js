import { registerUser, loginUser } from '../../useCases/auth/index.js'

export const registerCtrl = async (req, res, next) => {
  try {
    const result = await registerUser(req)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const loginCtrl = async (req, res, next) => {
  try {
    const result = await loginUser(req)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
