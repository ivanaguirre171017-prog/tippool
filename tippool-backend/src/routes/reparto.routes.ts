import { Router } from 'express';
import { RepartoController } from '../controllers/reparto.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();
const repartoController = new RepartoController();

router.use(authMiddleware);

router.post('/calcular', requireRole(['ENCARGADO']), repartoController.calcular);
router.get('/mis-repartos', repartoController.misRepartos);
router.get('/historial', requireRole(['ENCARGADO']), repartoController.historial);
router.get('/detalle/:id', repartoController.detalle);

export default router;
