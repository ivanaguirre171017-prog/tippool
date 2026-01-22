import { Router } from 'express';
import { CheckInController } from '../controllers/checkin.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();
const checkInController = new CheckInController();

router.use(authMiddleware);

// MOZO routes (but technically any employee can check in, spec mentioned 'Registrar entrada de MOZO' but usually everyone checks in. I'll allow Role.MOZO and Role.ENCARGADO if they work shifts, but mostly MOZOs. I'll not restrict by role explicitly other than Auth, assuming all active users check in.)
router.post('/entrada', checkInController.entry);
router.post('/salida', checkInController.exit);
router.get('/mis-checkins', checkInController.history);
router.get('/fecha/:fecha', requireRole(['ENCARGADO']), checkInController.byDate);

export default router;
