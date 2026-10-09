import bcrypt from 'bcrypt'

import User from '../models/userModel.js'

import AppError from '../utils/appError.js'

export const getMe = async (userId) => {

    const user = await User.findById(userId)

    if (!user) {

        throw new AppError('User not found', 404)
    }

    return user
}

export const updateMe = async (userId, data) => {

    const user = await User.findById(userId).select('+password')

    if (!user) {

        throw new AppError('User not found', 404)

    }


    if (data.email && data.email !== user.email) {

        const existing = await User.findOne({

            email: data.email.toLowerCase()
        })

        if (existing) {

            throw new AppError('Email already in use', 409)

        }

        user.email = data.email.toLowerCase()
    }

    if (data.name) {
        user.name = data.name
    }

    if (data.password) {

        if (data.password.length < 6) {

            throw new AppError('Password must be at least 6 characters', 400)

        }
        const salt = await bcrypt.genSalt(10)
        
        user.password = await bcrypt.hash(data.password, salt)
    }

    await user.save()

    return {
        id: user._id,
        name: user.name,
        email: user.email
    }
}