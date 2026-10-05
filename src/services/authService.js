import bcrypt from 'bcrypt'

import User from '../models/userModel.js'

import AppError from '../utils/appError.js'

import jwt from 'jsonwebtoken'

const hashPassword = function (pass) {

    if (typeof (pass) === 'string' && pass.length >= 6) {

        return bcrypt.hash(pass, 10)
    } else {
        throw new AppError('password is invalid', 400)
    }

}

export const seedDefaultUser = async function ()

{

    if (await User.exists({})) return

    await User.create({
        name: process.env.DEFAULT_USER_NAME,

        email: process.env.DEFAULT_USER_EMAIL,

        password: await hashPassword(process.env.DEFAULT_USER_PASSWORD),

    })
    console.log('admin hader')
}

export const login = async function (email, password) {

    if (typeof (email) !== 'string' || typeof (password) !== 'string') {

        throw new AppError('Email and password are required', 400)
    }
    const user = await User.findOne({
        email: email.toLocaleLowerCase()
    }).select('+password')

      const valid = user && (await bcrypt.compare(password, user.password))

    if (!valid) throw new AppError('Invalid email or password', 401)
    
    const token = jwt.sign({  id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })


    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }
}
export const register = async function (data) {
    const { name, email, password } = data;
    if (!name || !email || !password) {
        throw new AppError('Name, email, and password are required', 400);
    }
    if (typeof email !== 'string') {
        throw new AppError('Email must be a string', 400);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const hashedPassword = await hashPassword(password);
    
    const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
    });
    
    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    };
};
