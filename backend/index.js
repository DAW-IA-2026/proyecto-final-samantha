import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bearerToken from 'express-bearer-token'

import { setupRoutes } from './src/index.js'
import { errorHandler } from './src/middlewares/errorHandler.js'
import { notFound } from './src/middlewares/notFound.js'

const app = express()
const PORT = process.env.PORT || 3001

// Diagnostics to catch what triggers clean exit
process.on('beforeExit', () => {
  console.log('[DIAGNOSTIC] beforeExit event fired')
})
process.on('exit', (code) => {
  console.log('[DIAGNOSTIC] exit event fired with code:', code)
})

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(bearerToken())

// Root route — friendly JSON
app.get('/', (req, res) => {
  res.json({
    message: 'Needy games! API',
    status: 'ok',
    docs: '/api/health'
  })
})

setupRoutes(app)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT} (and http://0.0.0.0:${PORT})`)
})

server.on('error', (err) => {
  console.error('[SERVER_ERROR]', err)
})
