import { Router } from 'express';
import { SoporteController } from '../controllers/soporte.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const soporteController = new SoporteController();

router.post('/reportar', authMiddleware, soporteController.reportar);

export default router;
