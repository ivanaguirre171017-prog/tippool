import { prisma } from '../prisma';
import { hashPassword, comparePassword } from '../password';
import { generateToken } from '../auth';
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

        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    async changePassword(userId: string, data: any) {
        const { currentPassword, newPassword } = data;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }
}
