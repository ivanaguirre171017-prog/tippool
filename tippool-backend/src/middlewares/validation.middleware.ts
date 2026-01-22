import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util';

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

// Simple middleware to validate fields presence
export const validateFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missing = fields.filter(field => !req.body[field]);
        if (missing.length > 0) {
            return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
        }
        next();
    };
};
