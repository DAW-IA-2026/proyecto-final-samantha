import { auth } from './middlewares/auth.js'

export const setupRoutes = (app) => {
  // Health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

  // Auth
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      const { registerUser } = await import('./useCases/auth/index.js')
      const result = await registerUser(req)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  })
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { loginUser } = await import('./useCases/auth/index.js')
      const result = await loginUser(req)
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  // Users
  app.get('/api/users/me', auth({ required: true }), async (req, res, next) => {
    try {
      const { getMe } = await import('./useCases/users/index.js')
      const { data } = await getMe(req)
      const { userTransformer } = await import('./transformers/users/userTransformer.js')
      res.json({ data: userTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.put('/api/users/me', auth({ required: true }), async (req, res, next) => {
    try {
      const { updateMe } = await import('./useCases/users/index.js')
      const { data } = await updateMe(req)
      const { userTransformer } = await import('./transformers/users/userTransformer.js')
      res.json({ data: userTransformer(data) })
    } catch (error) {
      next(error)
    }
  })

  // Games — Sprint 2: auth required, scoped to user
  app.get('/api/games', auth({ required: true }), async (req, res, next) => {
    try {
      const { listGames } = await import('./useCases/games/index.js')
      const { data, meta } = await listGames(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.json({ data: data.map(gameTransformer), meta })
    } catch (error) {
      next(error)
    }
  })
  app.get('/api/games/:id', auth({ required: true }), async (req, res, next) => {
    try {
      const { getGame } = await import('./useCases/games/index.js')
      const { data } = await getGame(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.json({ data: gameTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.post('/api/games', auth({ required: true }), async (req, res, next) => {
    try {
      const { createGame } = await import('./useCases/games/index.js')
      const { data } = await createGame(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.status(201).json({ data: gameTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.put('/api/games/:id', auth({ required: true }), async (req, res, next) => {
    try {
      const { updateGame } = await import('./useCases/games/index.js')
      const { data } = await updateGame(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.json({ data: gameTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.delete('/api/games/:id', auth({ required: true }), async (req, res, next) => {
    try {
      const { deleteGame } = await import('./useCases/games/index.js')
      const { data } = await deleteGame(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.json({ data: gameTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.patch('/api/games/:id/complete', auth({ required: true }), async (req, res, next) => {
    try {
      const { completeGame } = await import('./useCases/games/index.js')
      const { data } = await completeGame(req)
      const { gameTransformer } = await import('./transformers/games/gameTransformer.js')
      res.json({ data: gameTransformer(data) })
    } catch (error) {
      next(error)
    }
  })

  // Categories
  app.get('/api/categories', async (req, res, next) => {
    try {
      const { listCategories } = await import('./useCases/categories/index.js')
      const { data, meta } = await listCategories()
      const { categoryTransformer } = await import('./transformers/categories/categoryTransformer.js')
      res.json({ data: data.map(categoryTransformer), meta })
    } catch (error) {
      next(error)
    }
  })
  app.get('/api/categories/:id', async (req, res, next) => {
    try {
      const { getCategory } = await import('./useCases/categories/index.js')
      const { data } = await getCategory(req)
      const { categoryTransformer } = await import('./transformers/categories/categoryTransformer.js')
      res.json({ data: categoryTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.post('/api/categories', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { createCategory } = await import('./useCases/categories/index.js')
      const { data } = await createCategory(req)
      const { categoryTransformer } = await import('./transformers/categories/categoryTransformer.js')
      res.status(201).json({ data: categoryTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.put('/api/categories/:id', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { updateCategory } = await import('./useCases/categories/index.js')
      const { data } = await updateCategory(req)
      const { categoryTransformer } = await import('./transformers/categories/categoryTransformer.js')
      res.json({ data: categoryTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.delete('/api/categories/:id', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { deleteCategory } = await import('./useCases/categories/index.js')
      const { data } = await deleteCategory(req)
      const { categoryTransformer } = await import('./transformers/categories/categoryTransformer.js')
      res.json({ data: categoryTransformer(data) })
    } catch (error) {
      next(error)
    }
  })

  // Tags
  app.get('/api/tags', async (req, res, next) => {
    try {
      const { listTags } = await import('./useCases/tags/index.js')
      const { data, meta } = await listTags()
      const { tagTransformer } = await import('./transformers/tags/tagTransformer.js')
      res.json({ data: data.map(tagTransformer), meta })
    } catch (error) {
      next(error)
    }
  })
  app.get('/api/tags/:id', async (req, res, next) => {
    try {
      const { getTag } = await import('./useCases/tags/index.js')
      const { data } = await getTag(req)
      const { tagTransformer } = await import('./transformers/tags/tagTransformer.js')
      res.json({ data: tagTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.post('/api/tags', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { createTag } = await import('./useCases/tags/index.js')
      const { data } = await createTag(req)
      const { tagTransformer } = await import('./transformers/tags/tagTransformer.js')
      res.status(201).json({ data: tagTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.put('/api/tags/:id', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { updateTag } = await import('./useCases/tags/index.js')
      const { data } = await updateTag(req)
      const { tagTransformer } = await import('./transformers/tags/tagTransformer.js')
      res.json({ data: tagTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
  app.delete('/api/tags/:id', auth({ required: true, roles: ['admin'] }), async (req, res, next) => {
    try {
      const { deleteTag } = await import('./useCases/tags/index.js')
      const { data } = await deleteTag(req)
      const { tagTransformer } = await import('./transformers/tags/tagTransformer.js')
      res.json({ data: tagTransformer(data) })
    } catch (error) {
      next(error)
    }
  })
}
