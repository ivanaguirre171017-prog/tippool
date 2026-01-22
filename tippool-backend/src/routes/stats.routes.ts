import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
const statsController = new StatsController();

router.use(authMiddleware);
router.use(requireRole([Role.ENCARGADO]));

router.get('/dashboard', statsController.getDashboard);

export default router;
