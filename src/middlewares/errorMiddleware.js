import AppError from '../utils/appError.js'


export const notFound = (req, res, next) => {

    next(new AppError(`Route not found ${req.method} ${req.originalUrl}`, 404))
}


export const errorHandler = (err, req, res, next) => {
    let status = err.statusCode || 500
    let message = err.message

    if (err.code === 11000) {
        status = 409
        message = `${Object.keys(err.keyValue)[0]} already exists`
    }
    else if (err.name === 'ValidationError') {
        status = 400
        message = Object.values(err.errors).map((e) => e.message).join(', ')
    }
    else if (err.name === 'CastError') {
        status = 400
        message = 'Invalid identifier'
    }
    
    else if (err.type === 'entity.parse.failed') {
        status = 400
        message = 'Invalid JSON body'
    }
    

    if (status === 500) {
        console.error(err)
        message = 'Internal server error'
    }

    res.status(status).json({
        message
    })
}