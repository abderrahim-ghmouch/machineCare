import express from 'express'

import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

import router from './routes/authRoutes.js'

const app = express()

app.use(express.json())



app.use('/api/auth',router)

app.use('/api/health', function test() { console.log('its working') })

app.use(notFound)

app.use(errorHandler)

export default app
