import dotenv from 'dotenv/config'


import app from './app.js'

import connectDB from './config/db.js'

import {seedDefaultUser} from './services/authService.js'

try {

    await connectDB()
    await seedDefaultUser()

    app.listen(process.env.PORT, () => console.log(`api is running on the ${process.env.PORT}`))

} catch (err) {

    console.error('api runming is failed', err.message)

  process.exit(1)
}