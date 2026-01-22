import { prisma } from '../config/database';

export class StatsService {
    async getDashboardStats(periodo: 'hoy' | 'semana' | 'mes' = 'mes') {
        let fechaInicio: Date;
        const fechaFin = new Date();

        switch (periodo) {
            case 'hoy':
                fechaInicio = new Date(new Date().setHours(0, 0, 0, 0));
                break;
            case 'semana':
                fechaInicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'mes':
            default:
                fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        }

        // Total de propinas del período
        const totalPropinas = await prisma.propina.aggregate({
            where: { fecha: { gte: fechaInicio, lte: fechaFin } },
            _sum: { monto: true },
            _count: true
        });

        // Propinas por día (últimos 7 días para el gráfico)
        // Note: Using raw query as provided in prompt. Adjusting for potential PostgreSQL vs SQLite diffs if needed, 
        // but schema.prisma says postgresql.
        const propinasUltimos7Dias: any[] = await prisma.$queryRaw`
            SELECT DATE(fecha) as dia, SUM(monto) as total
            FROM propinas
            WHERE fecha >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(fecha)
            ORDER BY dia
        `;

        // Propinas por método de pago
        const propinasPorMetodo = await prisma.propina.groupBy({
            by: ['metodoPago'],
            where: { fecha: { gte: fechaInicio, lte: fechaFin } },
            _sum: { monto: true },
            _count: true
        });

        // Top 5 empleados
        const topEmpleados = await prisma.repartoDetalle.groupBy({
            by: ['userId'],
            where: { fecha: { gte: fechaInicio, lte: fechaFin } },
            _sum: {
                montoAsignado: true,
                horasTrabajadas: true
            },
            _count: true,
            orderBy: { _sum: { montoAsignado: 'desc' } },
            take: 5
        });

        // Enriquecer con datos de usuario
        const topEmpleadosConDatos = await Promise.all(
            topEmpleados.map(async (emp) => {
                const user = await prisma.user.findUnique({
                    where: { id: emp.userId },
                    select: { nombre: true, apellido: true, rol: true }
                });
                return {
                    ...user,
                    totalPropinas: emp._sum.montoAsignado || 0,
                    horasTrabajadas: emp._sum.horasTrabajadas || 0,
                    numeroRepartos: emp._count
                };
            })
        );

        // Horas totales trabajadas
        const horasTotales = await prisma.checkIn.aggregate({
            where: {
                fecha: { gte: fechaInicio, lte: fechaFin },
                salida: { not: null }
            },
            _sum: { horasTrabajadas: true }
        });

        // Empleados trabajando ahora
        const empleadosTrabajandoAhora = await prisma.checkIn.count({
            where: { salida: null }
        });

        // Propinas pendientes
        const propinasPendientes = await prisma.propina.aggregate({
            where: { procesada: false },
            _sum: { monto: true },
            _count: true
        });

        // Último reparto
        const ultimoReparto = await prisma.repartoDetalle.findFirst({
            orderBy: { fecha: 'desc' },
            select: {
                fecha: true,
                montoAsignado: true
            }
        });

        // Calcular cambios porcentuales (comparar con período anterior)
        const diff = fechaFin.getTime() - fechaInicio.getTime();
        const periodoAnteriorInicio = new Date(fechaInicio.getTime() - diff);

        const totalPropinasPeriodoAnterior = await prisma.propina.aggregate({
            where: {
                fecha: {
                    gte: periodoAnteriorInicio,
                    lt: fechaInicio
                }
            },
            _sum: { monto: true },
            _count: true
        });

        const currentMonto = totalPropinas._sum.monto || 0;
        const prevMonto = totalPropinasPeriodoAnterior._sum.monto || 0;
        const cambioMonto = prevMonto !== 0 ? ((currentMonto - prevMonto) / prevMonto) * 100 : 0;

        const currentCount = totalPropinas._count || 0;
        const prevCount = totalPropinasPeriodoAnterior._count || 0;
        const cambioTransacciones = prevCount !== 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0;

        return {
            resumen: {
                totalPropinas: currentMonto,
                numeroTransacciones: currentCount,
                horasTotales: horasTotales._sum.horasTrabajadas || 0,
                cambioMonto: Math.round(cambioMonto),
                cambioTransacciones: Math.round(cambioTransacciones)
            },
            propinasPorDia: propinasUltimos7Dias,
            propinasPorMetodo,
            topEmpleados: topEmpleadosConDatos,
            estadoActual: {
                empleadosTrabajandoAhora,
                propinasPendientes: {
                    monto: propinasPendientes._sum.monto || 0,
                    cantidad: propinasPendientes._count
                },
                ultimoReparto: ultimoReparto ? {
                    fecha: ultimoReparto.fecha,
                    monto: ultimoReparto.montoAsignado
                } : null
            },
            promedios: {
                propinaPorHora: horasTotales._sum.horasTrabajadas
                    ? (currentMonto / horasTotales._sum.horasTrabajadas).toFixed(2)
                    : "0.00",
                horasPorEmpleado: topEmpleadosConDatos.length
                    ? (horasTotales._sum.horasTrabajadas || 0 / topEmpleadosConDatos.length).toFixed(1)
                    : "0.0"
            }
        };
    }
}
