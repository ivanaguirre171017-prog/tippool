import { prisma } from '../prisma';
import { Role, Propina } from '@prisma/client';

export class RepartoService {
    async calcularReparto(fecha: string) {
        const start = new Date(fecha);
        const end = new Date(fecha);
        end.setDate(end.getDate() + 1);

        return await prisma.$transaction(async (tx) => {
            const propinas = await tx.propina.findMany({
                where: {
                    fecha: { gte: start, lt: end },
                    procesada: false
                }
            });

            if (propinas.length === 0) {
                throw new Error('No hay propinas pendientes para esta fecha');
            }

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

            let totalPuntos = 0;
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
                            montoAsignado: parseFloat(montoAsignado.toFixed(2)),
                            horasTrabajadas: data.horas,
                            puntosRol: puntosRol
                        }
                    });
                    repartosCreated.push(reparto);
                }

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
        const detail = await prisma.repartoDetalle.findUnique({
            where: { id },
            include: { propina: true }
        });

        if (!detail) throw new Error('Reparto no encontrado');

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
