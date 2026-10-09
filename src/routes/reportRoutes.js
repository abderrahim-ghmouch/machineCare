import {
    Router
} from 'express'
import {
    createReport,
    getReports,
    getReport,
    updateReport
} from '../controllers/reportController.js'
import {
    protect
} from '../middlewares/authMiddleware.js'

const router = Router()

router.use(protect)

router.post('/', createReport)
router.get('/', getReports)
router.get('/:id', getReport)
router.put('/:id', updateReport)

export default router