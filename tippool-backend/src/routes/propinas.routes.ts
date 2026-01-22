import { Router } from 'express';
import { PropinasController } from '../controllers/propinas.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validateFields } from '../middlewares/validation.middleware';

const router = Router();
const propinasController = new PropinasController();

router.use(authMiddleware);

// Registrar propina logic? Can waiters register their own tips? Usually yes, or cashiers. Spec doesn't restrict.
router.post('/', validateFields(['monto', 'metodoPago']), propinasController.create);
router.get('/', propinasController.list);
router.get('/pendientes', propinasController.listPendientes);

export default router;
