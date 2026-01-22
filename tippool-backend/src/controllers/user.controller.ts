import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/response.util';

const userService = new UserService();

export class UserController {
    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            return successResponse(res, users);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching users', 500);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) return errorResponse(res, 'User not found', 404);
            return successResponse(res, user);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching user', 500);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { nombre, apellido, email, rol, fotoPerfil } = req.body;
            const user = await userService.updateUser(req.params.id, { nombre, apellido, email, rol, fotoPerfil });
            return successResponse(res, user, 'User updated successfully');
        } catch (error: any) {
            return errorResponse(res, 'Error updating user', 500);
        }
    }

    async uploadFoto(req: Request, res: Response) {
        try {
            if (!req.file) return errorResponse(res, 'No file uploaded', 400);

            const { uploadToCloudinary } = await import('../config/cloudinary');
            const url = await uploadToCloudinary(req.file.path);

            // Update user in DB
            const anyReq = req as any;
            if (anyReq.user) {
                await userService.updateUser(anyReq.user.userId, { fotoPerfil: url });
            }

            return successResponse(res, { url }, 'Photo uploaded successfully');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Error uploading photo', 500);
        }
    }

    async updatePreferences(req: Request, res: Response) {
        try {
            const anyReq = req as any;
            if (!anyReq.user) return errorResponse(res, 'Unauthorized', 401);

            const user = await userService.updatePreferences(anyReq.user.userId, req.body);
            return successResponse(res, user, 'Preferencias actualizadas');
        } catch (error: any) {
            return errorResponse(res, 'Error updating preferences', 500);
        }
    }

    async deleteAccount(req: Request, res: Response) {
        try {
            const anyReq = req as any;
            if (!anyReq.user) return errorResponse(res, 'Unauthorized', 401);

            await userService.permanentlyDelete(anyReq.user.userId);
            return successResponse(res, null, 'Cuenta eliminada correctamente');
        } catch (error: any) {
            return errorResponse(res, 'Error deleting account', 500);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await userService.deleteUser(req.params.id);
            return successResponse(res, null, 'User deactivated successfully');
        } catch (error: any) {
            return errorResponse(res, 'Error deleting user', 500);
        }
    }
}
