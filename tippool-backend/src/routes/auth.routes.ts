import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validateFields, validateEmail, validatePassword } from '../middlewares/validation.middleware';
import { errorResponse } from '../utils/response.util';

const router = Router();
const authController = new AuthController();

// Validators
const registerValidator = (req: any, res: any, next: any) => {
    const { email, password } = req.body;
    if (!validateEmail(email)) return errorResponse(res, 'Invalid email format', 400);
    if (!validatePassword(password)) return errorResponse(res, 'Password must be at least 6 characters', 400);
    next();
};

// Routes
// Solo ENCARGADO puede crear usuarios.
// Note: If no users exist, this might be impossible to call. Creating a seed or manual insert is expected.
router.post(
    '/register',
    authMiddleware,
    requireRole(['ENCARGADO']),
    validateFields(['email', 'password', 'nombre', 'apellido', 'rol']),
    registerValidator,
    authController.register
);

router.post(
    '/login',
    validateFields(['email', 'password']),
    authController.login
);

router.get('/me', authMiddleware, authController.me);
router.post('/cambiar-password', authMiddleware, authController.changePassword);

export default router;
