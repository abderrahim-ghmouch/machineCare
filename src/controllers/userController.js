import * as userService from '../services/userService.js'

export const getMe = async (req, res) => {

    const user = await userService.getMe(req.user._id)

    res.status(200).json(user)
}

export const updateMe = async (req, res) => {

    const user = await userService.updateMe(req.user._id, req.body)
    
    res.status(200).json(user)
}