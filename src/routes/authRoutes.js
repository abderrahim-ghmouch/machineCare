import { Router } from 'express'
import { login, register } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/login', login)
// Only authenticated users can create other user accounts
router.post('/register', protect, register)

export default router
