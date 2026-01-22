import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { UserPayload } from '../models/types';

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string, rol: Role): string => {
    return jwt.sign({ userId, rol }, SECRET, { expiresIn: EXPIRES_IN as any });
};

export const verifyToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
};
