import { listTags, getTag, createTag, updateTag, deleteTag } from '../../useCases/tags/index.js'
import { tagTransformer } from '../../transformers/tags/tagTransformer.js'

export const listTagsCtrl = async (req, res, next) => {
  try {
    const { data, meta } = await listTags()
    res.json({ data: data.map(tagTransformer), meta })
  } catch (error) {
    next(error)
  }
}

export const getTagCtrl = async (req, res, next) => {
  try {
    const { data } = await getTag(req)
    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createTagCtrl = async (req, res, next) => {
  try {
    const { data } = await createTag(req)
    res.status(201).json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateTagCtrl = async (req, res, next) => {
  try {
    const { data } = await updateTag(req)
    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteTagCtrl = async (req, res, next) => {
  try {
    const { data } = await deleteTag(req)
    res.json({ data: tagTransformer(data) })
  } catch (error) {
    next(error)
  }
}
