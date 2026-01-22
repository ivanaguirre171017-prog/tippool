import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/', requireRole(['ENCARGADO']), userController.getAll);
router.get('/:id', userController.getOne);
router.patch('/:id', requireRole(['ENCARGADO']), userController.update);
router.delete('/:id', requireRole(['ENCARGADO']), userController.delete);

// New endpoints
router.post('/upload-foto', upload.single('foto'), userController.uploadFoto);
router.delete('/mi-cuenta', userController.deleteAccount);
router.patch('/preferencias-notificaciones', userController.updatePreferences);

export default router;
