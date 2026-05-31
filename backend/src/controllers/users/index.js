export const getMe = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/users/index.js')).getMe(req)
    const { userTransformer } = await import('../../transformers/users/userTransformer.js')
    res.json({ data: userTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/users/index.js')).updateMe(req)
    const { userTransformer } = await import('../../transformers/users/userTransformer.js')
    res.json({ data: userTransformer(data) })
  } catch (error) {
    next(error)
  }
}
