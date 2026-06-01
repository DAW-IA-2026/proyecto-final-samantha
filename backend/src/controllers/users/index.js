import { getMe, updateMe } from '../../useCases/users/index.js'
import { userTransformer } from '../../transformers/users/userTransformer.js'

export const getMeCtrl = async (req, res, next) => {
  try {
    const { data } = await getMe(req)
    res.json({ data: userTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateMeCtrl = async (req, res, next) => {
  try {
    const { data } = await updateMe(req)
    res.json({ data: userTransformer(data) })
  } catch (error) {
    next(error)
  }
}
