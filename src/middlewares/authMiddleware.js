import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import AppError from '../utils/appError.js'

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }
        
        req.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};
