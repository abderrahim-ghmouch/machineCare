import * as authService from '../services/authService.js'

export const login = async (req, res) => {
    const { email, password } = await req.body
    
    const result = await authService.login(email, password)
    res.status(200).json(result)
}