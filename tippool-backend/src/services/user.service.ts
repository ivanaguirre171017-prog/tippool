import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export class UserService {
    async getAllUsers() {
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                activo: true,
                createdAt: true
            }
        });
    }

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                activo: true,
                createdAt: true
            }
        });
    }

    async updateUser(id: string, data: any) {
        return await prisma.user.update({
            where: { id },
            data: data,
            select: {
                id: true,
                email: true,
                nombre: true,
                apellido: true,
                rol: true,
                activo: true,
                fotoPerfil: true,
                updatedAt: true
            }
        });
    }

    async deleteUser(id: string) {
        // Soft delete
        return await prisma.user.update({
            where: { id },
            data: { activo: false },
        });
    }

    async updatePreferences(id: string, prefs: any) {
        return await prisma.user.update({
            where: { id },
            data: {
                pushEnabled: prefs.pushEnabled,
                nuevoRepartoNotif: prefs.nuevoReparto,
                propinaRegistradaNotif: prefs.propinaRegistrada,
                checkinsEmpleadosNotif: prefs.checkinsEmpleados,
                sonidoEnabled: prefs.sonido,
                vibracionEnabled: prefs.vibracion
            }
        });
    }

    async permanentlyDelete(id: string) {
        return await prisma.user.delete({
            where: { id }
        });
    }
}
