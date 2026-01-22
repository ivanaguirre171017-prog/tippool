import { prisma } from '../config/database';

export class PropinasService {
    async createPropina(data: { monto: number; metodoPago: string }) {
        if (data.monto <= 0) throw new Error('Monto must be positive');

        return await prisma.propina.create({
            data: {
                monto: data.monto,
                metodoPago: data.metodoPago, // "TRANSFERENCIA", "QR", "EFECTIVO"
                procesada: false
            }
        });
    }

    async getPropinas(filters: any) {
        const where: any = {};
        if (filters.fecha) {
            // Simple date filter
            const start = new Date(filters.fecha);
            const end = new Date(filters.fecha);
            end.setDate(end.getDate() + 1);
            where.fecha = { gte: start, lt: end };
        }
        if (filters.procesada !== undefined) {
            where.procesada = filters.procesada === 'true';
        }

        return await prisma.propina.findMany({
            where,
            orderBy: { fecha: 'desc' }
        });
    }

    async getPendientes() {
        return await prisma.propina.findMany({
            where: { procesada: false },
            orderBy: { fecha: 'asc' }
        });
    }
}
