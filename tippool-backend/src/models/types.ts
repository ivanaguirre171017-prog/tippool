import { Request } from 'express';
import { Role } from '@prisma/client';

export interface UserPayload {
    userId: string;
    rol: Role;
}

export interface CustomRequest extends Request {
    user?: UserPayload;
}
