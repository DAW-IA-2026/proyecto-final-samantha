export const listCategories = async (req, res, next) => {
  try {
    const { data, meta } = await (await import('../../useCases/categories/index.js')).listCategories()
    const { categoryTransformer } = await import('../../transformers/categories/categoryTransformer.js')

    res.json({
      data: data.map(categoryTransformer),
      meta
    })
  } catch (error) {
    next(error)
  }
}

export const getCategory = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/categories/index.js')).getCategory(req)
    const { categoryTransformer } = await import('../../transformers/categories/categoryTransformer.js')

    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/categories/index.js')).createCategory(req)
    const { categoryTransformer } = await import('../../transformers/categories/categoryTransformer.js')

    res.status(201).json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/categories/index.js')).updateCategory(req)
    const { categoryTransformer } = await import('../../transformers/categories/categoryTransformer.js')

    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/categories/index.js')).deleteCategory(req)
    const { categoryTransformer } = await import('../../transformers/categories/categoryTransformer.js')

    res.json({ data: categoryTransformer(data) })
  } catch (error) {
    next(error)
  }
}
