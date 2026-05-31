export const listTags = async (req, res, next) => {
  try {
    const { data, meta } = await (await import('../../useCases/tags/index.js')).listTags()
    const { tagTransformer } = await import('../../transformers/tags/tagTransformer.js')

    res.json({
      data: data.map(tagTransformer),
      meta
    })
  } catch (error) {
    next(error)
  }
}

export const getTag = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/tags/index.js')).getTag(req)
    const { tagTransformer } = await import('../../transformers/tags/tagTransformer.js')

    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createTag = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/tags/index.js')).createTag(req)
    const { tagTransformer } = await import('../../transformers/tags/tagTransformer.js')

    res.status(201).json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateTag = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/tags/index.js')).updateTag(req)
    const { tagTransformer } = await import('../../transformers/tags/tagTransformer.js')

    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteTag = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/tags/index.js')).deleteTag(req)
    const { tagTransformer } = await import('../../transformers/tags/tagTransformer.js')

    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}
