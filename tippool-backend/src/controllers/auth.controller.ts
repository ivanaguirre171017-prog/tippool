import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { CustomRequest } from '../models/types';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            return successResponse(res, user, 'User registered successfully', 201);
        } catch (error: any) {
            if (error.message === 'Email already exists') {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, error.message || 'Error registering user', 500);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            return successResponse(res, result, 'Login successful');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Login failed', 401);
        }
    }

    async me(req: CustomRequest, res: Response) {
        if (!req.user) return errorResponse(res, 'Not authenticated', 401);
        return successResponse(res, req.user, 'Current user data');
    }

    async changePassword(req: CustomRequest, res: Response) {
        try {
            if (!req.user) return errorResponse(res, 'Unauthorized', 401);
            await authService.changePassword(req.user.userId, req.body);
            return successResponse(res, null, 'Contraseña actualizada correctamente');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Error changing password', 400);
        }
    }
}
