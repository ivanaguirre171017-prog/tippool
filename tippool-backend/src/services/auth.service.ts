import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { Role } from '@prisma/client';

export class AuthService {
    async register(data: any) {
        const { email, password, nombre, apellido, rol } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nombre,
                apellido,
                rol: rol as Role,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                activo: true,
                createdAt: true,
            }
        });

        return user;
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.activo) {
            throw new Error('Invalid credentials or inactive account');
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user.id, user.rol);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }
}
