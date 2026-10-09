import {
    Router
} from 'express'
import {
    createMachine,
    getMachines,
    getMachine,
    updateMachine,
    deleteMachine,
    getMachineReports
} from '../controllers/machineController.js'
import {
    protect
} from '../middlewares/authMiddleware.js'

const router = Router()

router.use(protect)

router.post('/', createMachine)
router.get('/', getMachines)
router.get('/:id', getMachine)
router.put('/:id', updateMachine)
router.delete('/:id', deleteMachine)

router.get('/:id/reports', getMachineReports)

export default router