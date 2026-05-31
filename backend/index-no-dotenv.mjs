import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bearerToken from 'express-bearer-token'

import { setupRoutes } from './src/index.js'
import { errorHandler } from './src/middlewares/errorHandler.js'
import { notFound } from './src/middlewares/notFound.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(bearerToken())

// Root route — friendly JSON
app.get('/', (req, res) => {
  res.json({
    message: 'Please, games are needy! API',
    status: 'ok',
    docs: '/api/health'
  })
})

setupRoutes(app)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT} (and http://0.0.0.0:${PORT})`)
})
