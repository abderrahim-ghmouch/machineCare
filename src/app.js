import express from 'express'

const app = express()

app.use(express.json())

app.get('/api/health',function test(){console.log('its working')})

export default app
