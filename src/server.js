import dotenv from 'dotenv/config'


import app from './app.js'

import connectDB from './config/db.js'

try {
    
    await connectDB()
    app.listen(process.env.PORT, () => console.log(`api is running on the ${process.env.PORT}`))
    
} catch (err) {
    
    console.error('api runming is failed', err.message)
    
    exit(1)
}
