import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { CustomRequest } from '../models/types';
import { errorResponse } from '../utils/response.util';
import { Role } from '@prisma/client';

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return errorResponse(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
};

export const requireRole = (roles: Role[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.rol)) {
            return errorResponse(res, 'Access denied: Insufficient permissions', 403);
        }
        next();
    };
};
