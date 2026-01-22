import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import api from '../../api/axios.config';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

// Tipos
interface Estadisticas {
    resumen: {
        totalPropinas: number;
        numeroTransacciones: number;
        horasTotales: number;
        cambioMonto: number;
        cambioTransacciones: number;
    };
    propinasPorDia: Array<{ dia: string; total: number }>;
    propinasPorMetodo: Array<{
        metodoPago: string;
        _sum: { monto: number };
        _count: number;
    }>;
    topEmpleados: Array<{
        nombre: string;
        apellido: string;
        rol: string;
        totalPropinas: number;
        horasTrabajadas: number;
        numeroRepartos: number;
    }>;
    estadoActual: {
        empleadosTrabajandoAhora: number;
        propinasPendientes: { monto: number; cantidad: number };
        ultimoReparto: { fecha: string; monto: number } | null;
    };
    promedios: {
        propinaPorHora: string;
        horasPorEmpleado: string;
    };
}

const EstadisticasScreen = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes'>('mes');
    const [stats, setStats] = useState<Estadisticas | null>(null);

    const fetchEstadisticas = async () => {
        try {
            const { data } = await api.get(`/stats/dashboard?periodo=${periodo}`);
            setStats(data.data); // data is the axios response, data.data is our response wrapper, data.data.data is the actual stats
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEstadisticas();
    }, [periodo]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEstadisticas();
    };

    if (loading && !stats) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!stats) return null;

    // Preparar datos para gráficos
    const barChartData = {
        labels: stats.propinasPorDia.length > 0
            ? stats.propinasPorDia.map(d => new Date(d.dia).toLocaleDateString('es', { weekday: 'short' }))
            : ['-'],
        datasets: [{
            data: stats.propinasPorDia.length > 0
                ? stats.propinasPorDia.map(d => d.total)
                : [0]
        }]
    };

    const pieChartData = stats.propinasPorMetodo.map((metodo, index) => ({
        name: metodo.metodoPago,
        population: metodo._sum.monto,
        color: [COLORS.primary, COLORS.secondary, COLORS.success][index % 3],
        legendFontColor: COLORS.text,
        legendFontSize: 12
    }));

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Filtros de Período */}
            <View style={styles.filtrosContainer}>
                <FilterButton
                    title="Hoy"
                    active={periodo === 'hoy'}
                    onPress={() => setPeriodo('hoy')}
                />
                <FilterButton
                    title="Semana"
                    active={periodo === 'semana'}
                    onPress={() => setPeriodo('semana')}
                />
                <FilterButton
                    title="Mes"
                    active={periodo === 'mes'}
                    onPress={() => setPeriodo('mes')}
                />
            </View>

            {/* KPIs */}
            <Text style={styles.sectionTitle}>Resumen del Período</Text>
            <View style={styles.kpiRow}>
                <KPICard
                    title="Total"
                    value={`$${stats.resumen.totalPropinas.toLocaleString()}`}
                    change={stats.resumen.cambioMonto}
                    icon="💰"
                />
                <KPICard
                    title="Propinas"
                    value={stats.resumen.numeroTransacciones.toString()}
                    change={stats.resumen.cambioTransacciones}
                    icon="📊"
                />
                <KPICard
                    title="Horas"
                    value={`${Number(stats.resumen.horasTotales).toFixed(1)}h`}
                    change={0}
                    icon="⏱️"
                />
            </View>

            {/* Gráfico de Barras */}
            <Text style={styles.sectionTitle}>Propinas por Día</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={barChartData}
                    width={Dimensions.get('window').width - 64}
                    height={200}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: COLORS.card,
                        backgroundGradientFrom: COLORS.card,
                        backgroundGradientTo: COLORS.card,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                        labelColor: (opacity = 1) => COLORS.text,
                        style: { borderRadius: 16 },
                        propsForDots: { r: "6", strokeWidth: "2", stroke: COLORS.primary }
                    }}
                    verticalLabelRotation={30}
                    style={styles.chart}
                />
            </View>

            {/* Gráfico de Torta */}
            <Text style={styles.sectionTitle}>Métodos de Pago</Text>
            <View style={styles.chartContainer}>
                {pieChartData.length > 0 ? (
                    <PieChart
                        data={pieChartData}
                        width={Dimensions.get('window').width - 64}
                        height={180}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        absolute
                    />
                ) : (
                    <Text style={styles.emptyText}>Sin datos de métodos de pago</Text>
                )}
            </View>

            {/* Top Empleados */}
            <Text style={styles.sectionTitle}>Top 5 Empleados</Text>
            {stats.topEmpleados.length > 0 ? (
                stats.topEmpleados.map((emp, index) => (
                    <TopEmpleadoCard
                        key={index}
                        rank={index + 1}
                        empleado={emp}
                    />
                ))
            ) : (
                <Text style={styles.emptyText}>No hay datos de empleados</Text>
            )}

            {/* Promedios */}
            <Text style={styles.sectionTitle}>Análisis de Turnos</Text>
            <View style={styles.analisisCard}>
                <AnalisisRow
                    label="Promedio propina/hora"
                    value={`$${stats.promedios.propinaPorHora}`}
                />
                <AnalisisRow
                    label="Promedio horas/empleado"
                    value={`${stats.promedios.horasPorEmpleado}h`}
                />
            </View>

            {/* Estado Actual */}
            <Text style={styles.sectionTitle}>Estado Actual</Text>
            <View style={styles.estadoCard}>
                <EstadoRow
                    icon="🟢"
                    label="Empleados trabajando"
                    value={stats.estadoActual.empleadosTrabajandoAhora.toString()}
                />
                <EstadoRow
                    icon="⚠️"
                    label="Propinas pendientes"
                    value={`$${stats.estadoActual.propinasPendientes.monto.toLocaleString()} (${stats.estadoActual.propinasPendientes.cantidad})`}
                />
                {stats.estadoActual.ultimoReparto && (
                    <EstadoRow
                        icon="✅"
                        label="Último reparto"
                        value={`${new Date(stats.estadoActual.ultimoReparto.fecha).toLocaleDateString()} - $${stats.estadoActual.ultimoReparto.monto.toLocaleString()}`}
                    />
                )}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

// Componentes auxiliares
const FilterButton = ({ title, active, onPress }: any) => (
    <TouchableOpacity
        style={[styles.filterButton, active && styles.filterButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.filterText, active && styles.filterTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const KPICard = ({ title, value, change, icon }: any) => (
    <View style={styles.kpiCard}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiValue}>{value}</Text>
        <Text style={styles.kpiTitle}>{title}</Text>
        {change !== 0 && (
            <View style={[
                styles.changeBadge,
                { backgroundColor: change > 0 ? COLORS.success + '20' : COLORS.error + '20' }
            ]}>
                <Text style={[styles.changeText, { color: change > 0 ? COLORS.success : COLORS.error }]}>
                    {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                </Text>
            </View>
        )}
    </View>
);

const TopEmpleadoCard = ({ rank, empleado }: any) => {
    const getMedal = (rank: number) => {
        const medals = ['🥇', '🥈', '🥉'];
        return rank <= 3 ? medals[rank - 1] : `${rank}º`;
    };

    return (
        <View style={[
            styles.topEmpleadoCard,
            rank <= 3 && styles.topEmpleadoCardHighlight
        ]}>
            <Text style={styles.rankMedal}>{getMedal(rank)}</Text>
            <View style={styles.empleadoInfo}>
                <Text style={styles.empleadoNombre}>
                    {empleado.nombre} {empleado.apellido}
                </Text>
                <Text style={styles.empleadoRol}>{empleado.rol}</Text>
                <View style={styles.empleadoStats}>
                    <Text style={styles.statText}>💵 ${empleado.totalPropinas.toLocaleString()}</Text>
                    <Text style={styles.statText}>⏱️ {Number(empleado.horasTrabajadas).toFixed(1)}h</Text>
                    <Text style={styles.statText}>📊 {empleado.numeroRepartos}</Text>
                </View>
            </View>
        </View>
    );
};

const AnalisisRow = ({ label, value }: any) => (
    <View style={styles.analisisRow}>
        <Text style={styles.analisisLabel}>{label}</Text>
        <Text style={styles.analisisValue}>{value}</Text>
    </View>
);

const EstadoRow = ({ icon, label, value }: any) => (
    <View style={styles.estadoRow}>
        <Text style={styles.estadoIcon}>{icon}</Text>
        <View style={styles.estadoInfo}>
            <Text style={styles.estadoLabel}>{label}</Text>
            <Text style={styles.estadoValue}>{value}</Text>
        </View>
    </View>
);

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        padding: SPACING.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background
    },
    filtrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
        gap: SPACING.sm
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
    },
    filterText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.caption,
        fontWeight: '500'
    },
    filterTextActive: {
        color: '#FFFFFF'
    },
    sectionTitle: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md
    },
    kpiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.sm
    },
    kpiCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    kpiIcon: {
        fontSize: 24,
        marginBottom: 4
    },
    kpiValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    kpiTitle: {
        fontSize: 10,
        color: COLORS.textLight,
        textAlign: 'center'
    },
    changeBadge: {
        marginTop: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm
    },
    changeText: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    chartContainer: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    chart: {
        borderRadius: BORDER_RADIUS.md,
        marginVertical: 8
    },
    topEmpleadoCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    topEmpleadoCardHighlight: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary
    },
    rankMedal: {
        fontSize: 28,
        marginRight: SPACING.md
    },
    empleadoInfo: {
        flex: 1
    },
    empleadoNombre: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    empleadoRol: {
        fontSize: FONT_SIZE.small,
        color: COLORS.textLight,
        marginBottom: 6
    },
    empleadoStats: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statText: {
        fontSize: 11,
        color: COLORS.text
    },
    analisisCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    analisisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    analisisLabel: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight
    },
    analisisValue: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text
    },
    estadoCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    estadoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    estadoIcon: {
        fontSize: 20,
        marginRight: SPACING.md
    },
    estadoInfo: {
        flex: 1
    },
    estadoLabel: {
        fontSize: FONT_SIZE.small,
        color: COLORS.textLight,
    },
    estadoValue: {
        fontSize: FONT_SIZE.caption,
        fontWeight: '600',
        color: COLORS.text
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.caption,
        marginVertical: 20
    }
});

export default EstadisticasScreen;
