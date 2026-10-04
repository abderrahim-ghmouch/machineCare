'use strict'
import mongoose from "mongoose"

const connectDB =async function () {
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log('mongoDB is conectrd')

}

export default connectDB