import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../../useCases/categories/index.js'
import { categoryTransformer } from '../../transformers/categories/categoryTransformer.js'

export const listCategoriesCtrl = async (req, res, next) => {
  try {
    const { data, meta } = await listCategories()
    res.json({ data: data.map(categoryTransformer), meta })
  } catch (error) {
    next(error)
  }
}

export const getCategoryCtrl = async (req, res, next) => {
  try {
    const { data } = await getCategory(req)
    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createCategoryCtrl = async (req, res, next) => {
  try {
    const { data } = await createCategory(req)
    res.status(201).json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateCategoryCtrl = async (req, res, next) => {
  try {
    const { data } = await updateCategory(req)
    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryCtrl = async (req, res, next) => {
  try {
    const { data } = await deleteCategory(req)
    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}
