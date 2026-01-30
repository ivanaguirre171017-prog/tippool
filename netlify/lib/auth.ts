import jwt from 'jsonwebtoken';
import { HandlerEvent } from '@netlify/functions';


export interface JWTPayload {
    userId: string;
    rol: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string, rol: string): string => {
    return jwt.sign({ userId, rol }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};


