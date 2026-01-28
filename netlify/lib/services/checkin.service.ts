import { prisma } from './prisma';
import { Role } from '@prisma/client';

export class CheckInService {
    async checkIn(userId: string) {
        const activeCheckIn = await prisma.checkIn.findFirst({
            where: {
                userId,
                salida: null
            }
        });

        if (activeCheckIn) {
            throw new Error('Ya tienes un turno abierto');
        }

        return await prisma.checkIn.create({
            data: {
                userId,
                entrada: new Date()
            }
        });
    }

    async checkOut(userId: string) {
        const activeCheckIn = await prisma.checkIn.findFirst({
            where: {
                userId,
                salida: null
            }
        });

        if (!activeCheckIn) {
            throw new Error('No tienes un turno abierto para cerrar');
        }

        const salida = new Date();
        const entrada = new Date(activeCheckIn.entrada);

        const diffMs = salida.getTime() - entrada.getTime();
        const horasTrabajadas = diffMs / (1000 * 60 * 60);

        return await prisma.checkIn.update({
            where: { id: activeCheckIn.id },
            data: {
                salida,
                horasTrabajadas
            }
        });
    }

    async getHistory(userId: string) {
        return await prisma.checkIn.findMany({
            where: { userId },
            orderBy: { entrada: 'desc' }
        });
    }

    async getByDate(fechaStr: string) {
        const start = new Date(fechaStr);
        const end = new Date(fechaStr);
        end.setDate(end.getDate() + 1);

        return await prisma.checkIn.findMany({
            where: {
                entrada: {
                    gte: start,
                    lt: end
                }
            },
            include: {
                user: {
                    select: { nombre: true, apellido: true, rol: true }
                }
            }
        });
    }
}
