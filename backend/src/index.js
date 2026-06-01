import {
  listGamesCtrl,
  getGameCtrl,
  createGameCtrl,
  updateGameCtrl,
  deleteGameCtrl,
  completeGameCtrl
} from './controllers/games/index.js'
import {
  listCategoriesCtrl,
  getCategoryCtrl,
  createCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl
} from './controllers/categories/index.js'
import {
  listTagsCtrl,
  getTagCtrl,
  createTagCtrl,
  updateTagCtrl,
  deleteTagCtrl
} from './controllers/tags/index.js'
import { registerCtrl, loginCtrl } from './controllers/auth/index.js'
import { getMeCtrl, updateMeCtrl } from './controllers/users/index.js'
import { searchExternalGames } from './services/externalGameService.js'
import { auth } from './middlewares/auth.js'

export const setupRoutes = (app) => {
  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  // Auth
  app.post('/auth/register', registerCtrl)
  app.post('/auth/login', loginCtrl)

  // Users
  app.get('/users/me', auth({ required: true }), getMeCtrl)
  app.put('/users/me', auth({ required: true }), updateMeCtrl)

  // Games — Sprint 2: auth required, scoped to user
  app.get('/games', auth({ required: true }), listGamesCtrl)
  app.get('/games/ext-finder', auth({ required: true }), async (req, res, next) => {
    try {
      const query = req.query.q
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: 'Query parameter "q" is required' })
      }
      const results = await searchExternalGames(query.trim())
      res.json({ data: results })
    } catch (error) {
      next(error)
    }
  })
  app.get('/games/:id', auth({ required: true }), getGameCtrl)
  app.post('/games', auth({ required: true }), createGameCtrl)
  app.put('/games/:id', auth({ required: true }), updateGameCtrl)
  app.delete('/games/:id', auth({ required: true }), deleteGameCtrl)
  app.patch('/games/:id/complete', auth({ required: true }), completeGameCtrl)

  // Categories
  app.get('/categories', listCategoriesCtrl)
  app.get('/categories/:id', getCategoryCtrl)
  app.post('/categories', auth({ required: true, roles: ['admin'] }), createCategoryCtrl)
  app.put('/categories/:id', auth({ required: true, roles: ['admin'] }), updateCategoryCtrl)
  app.delete('/categories/:id', auth({ required: true, roles: ['admin'] }), deleteCategoryCtrl)

  // Tags
  app.get('/tags', listTagsCtrl)
  app.get('/tags/:id', getTagCtrl)
  app.post('/tags', auth({ required: true, roles: ['admin'] }), createTagCtrl)
  app.put('/tags/:id', auth({ required: true, roles: ['admin'] }), updateTagCtrl)
  app.delete('/tags/:id', auth({ required: true, roles: ['admin'] }), deleteTagCtrl)
}
