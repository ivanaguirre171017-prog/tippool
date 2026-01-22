import { prisma } from '../config/database';
import { Role, Propina } from '@prisma/client';

export class RepartoService {
    async calcularReparto(fecha: string) {
        // 1. Define date range for "the day"
        const start = new Date(fecha);
        const end = new Date(fecha);
        end.setDate(end.getDate() + 1);

        return await prisma.$transaction(async (tx) => {
            // 2. Get pending propinas for date
            const propinas = await tx.propina.findMany({
                where: {
                    fecha: { gte: start, lt: end },
                    procesada: false
                }
            });

            if (propinas.length === 0) {
                throw new Error('No hay propinas pendientes para esta fecha');
            }

            // 3. Get completed checkins for date
            const checkins = await tx.checkIn.findMany({
                where: {
                    fecha: { gte: start, lt: end },
                    salida: { not: null }
                },
                include: { user: true }
            });

            if (checkins.length === 0) {
                throw new Error('No hay turnos cerrados (check-ins) para repartir en esta fecha');
            }

            // 4. Calculate Total Points
            let totalPuntos = 0;
            const userPoints: Map<string, { checkInId: string, puntos: number, horas: number, userId: string }> = new Map();

            // Aggregate hours per user? Or just use checkins? If a user has multiple checkins, sum them?
            // Spec says "Obtener check-ins completos...". Ideally sum hours per user.
            const userHours: Map<string, { horas: number, rol: Role }> = new Map();

            for (const ci of checkins) {
                const horas = ci.horasTrabajadas || 0;
                const rol = ci.user.rol;

                if (!userHours.has(ci.userId)) {
                    userHours.set(ci.userId, { horas: 0, rol });
                }
                const current = userHours.get(ci.userId)!;
                current.horas += horas;
            }

            userHours.forEach((data, userId) => {
                const puntosRol = data.rol === 'ENCARGADO' ? 2 : 1;
                const puntos = data.horas * puntosRol;
                totalPuntos += puntos;
            });

            if (totalPuntos === 0) {
                throw new Error('Total de puntos es 0, no se puede repartir');
            }

            // 5. Create RepartoDetalle for each Propina -> User
            const repartosCreated = [];

            for (const propina of propinas) {
                for (const [userId, data] of userHours.entries()) {
                    const puntosRol = data.rol === Role.ENCARGADO ? 2 : 1;
                    const userPuntos = data.horas * puntosRol;
                    const participacion = userPuntos / totalPuntos;
                    const montoAsignado = propina.monto * participacion;

                    const reparto = await tx.repartoDetalle.create({
                        data: {
                            propinaId: propina.id,
                            userId: userId,
                            montoAsignado: parseFloat(montoAsignado.toFixed(2)), // Should use Decimal in DB, but Float here
                            horasTrabajadas: data.horas,
                            puntosRol: puntosRol
                        }
                    });
                    repartosCreated.push(reparto);
                }

                // Mark propina as processed
                await tx.propina.update({
                    where: { id: propina.id },
                    data: { procesada: true }
                });
            }

            return { propinasProcesadas: propinas.length, repartosGenerados: repartosCreated.length };
        });
    }

    async getMisRepartos(userId: string, fechaDesde?: string) {
        const where: any = { userId };
        if (fechaDesde) {
            where.fecha = { gte: new Date(fechaDesde) };
        }
        return await prisma.repartoDetalle.findMany({
            where,
            include: { propina: true },
            orderBy: { fecha: 'desc' }
        });
    }

    async getDetalle(id: string) {
        // This gets the detail for ONE RepartoDetalle (one user's share of ONE propina)
        // But the UI wants the detail for the WHOLE DAY'S reparto.
        // Let's find this reparto first
        const detail = await prisma.repartoDetalle.findUnique({
            where: { id },
            include: { propina: true }
        });

        if (!detail) throw new Error('Reparto no encontrado');

        // Now find all propinas and repartos for the SAME DATE
        const start = new Date(detail.fecha);
        start.setHours(0, 0, 0, 0);
        const end = new Date(detail.fecha);
        end.setHours(23, 59, 59, 999);

        const allRepartosToday = await prisma.repartoDetalle.findMany({
            where: {
                fecha: { gte: start, lt: end }
            }
        });

        const allPropinasToday = await prisma.propina.findMany({
            where: {
                fecha: { gte: start, lt: end },
                procesada: true
            }
        });

        const pozoTotal = allPropinasToday.reduce((sum, p) => sum + p.monto, 0);
        const uniqueUsers = new Set(allRepartosToday.map(r => r.userId));

        // Sum total points
        // We need to be careful here because totalPuntos might depend on how it was calculated.
        // In calcularReparto: totalPuntos += puntos; (sum of hours * multiplier for each unique user)
        // Let's re-calculate it based on the repartos we found.
        // Since each RepartoDetalle stores the puntosRol and horasTrabajadas for THAT checkin...
        // Actually RepartoDetalle stores entries PER PROPINA.
        // So we should group by user and sum points.
        const userPointsMap: Map<string, number> = new Map();
        allRepartosToday.forEach(r => {
            if (!userPointsMap.has(r.userId)) {
                userPointsMap.set(r.userId, r.horasTrabajadas * r.puntosRol);
            }
        });

        let totalPuntos = 0;
        userPointsMap.forEach(p => totalPuntos += p);

        const desglosePropinas = allPropinasToday.reduce((acc: any, p) => {
            acc[p.metodoPago] = (acc[p.metodoPago] || 0) + p.monto;
            return acc;
        }, {});

        return {
            ...detail,
            pozoTotal,
            numeroEmpleados: uniqueUsers.size,
            totalPuntos,
            desglosePropinas
        };
    }

    async getHistorial(fecha?: string) {
        const where: any = {};
        if (fecha) {
            const start = new Date(fecha);
            const end = new Date(fecha);
            end.setDate(end.getDate() + 1);
            where.fecha = { gte: start, lt: end };
        }

        return await prisma.repartoDetalle.findMany({
            where,
            orderBy: { fecha: 'desc' },
            include: { user: { select: { nombre: true, apellido: true } }, propina: true }
        });
    }
}
