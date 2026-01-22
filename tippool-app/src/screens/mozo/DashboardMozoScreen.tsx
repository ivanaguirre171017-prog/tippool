import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';
import { checkinsApi } from '../../api/checkins.api';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ResumenCard } from '../../components/common/ResumenCard';
import { TiempoTranscurrido } from '../../components/common/TiempoTranscurrido';
import { CheckIn, Reparto } from '../../types';
import { useNavigation } from '@react-navigation/native';

export default function DashboardMozoScreen() {
    const { user } = useAuthStore();
    const navigation = useNavigation<any>();
    const [checkInActivo, setCheckInActivo] = useState<CheckIn | null>(null);
    const [resumenHoy, setResumenHoy] = useState({ horas: 0, propinas: 0 });
    const [ultimosRepartos, setUltimosRepartos] = useState<Reparto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const checkin = await checkinsApi.getActiveCheckIn();
            setCheckInActivo(checkin || null);

            const hoy = format(new Date(), 'yyyy-MM-dd');
            const checkins = await checkinsApi.getMyHistory(hoy);
            const horasHoy = checkins
                .filter(c => c.horasTrabajadas !== null)
                .reduce((sum, c) => sum + (c.horasTrabajadas || 0), 0);

            const repartosHoy = await repartosApi.getMyRepartos({ fechaDesde: hoy });
            const propinasHoy = repartosHoy.reduce((sum, r) => sum + r.montoAsignado, 0);

            setResumenHoy({ horas: horasHoy, propinas: propinasHoy });

            const repartosRecientes = await repartosApi.getMyRepartos({ limit: 3 });
            setUltimosRepartos(repartosRecientes);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            const data = await checkinsApi.entry();
            setCheckInActivo(data);
            Alert.alert('✅ Check-in exitoso', 'Tu turno ha comenzado');
            loadData();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar el check-in');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        Alert.alert(
            '¿Finalizar turno?',
            '¿Estás seguro que quieres hacer check-out?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            const data = await checkinsApi.exit();
                            setCheckInActivo(null);
                            Alert.alert(
                                '✅ Check-out exitoso',
                                `Trabajaste ${(data.horasTrabajadas || 0).toFixed(2)} horas en este turno`
                            );
                            loadData();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar el check-out');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) return <LoadingScreen />;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Hola, {user?.nombre}</Text>
                <Text style={styles.role}>Mozo</Text>
            </View>

            <Text style={styles.sectionTitle}>ESTADO DEL TURNO</Text>

            <View style={[styles.turnoCard, checkInActivo && styles.turnoCardActive]}>
                <MaterialIcons
                    name={checkInActivo ? "check-circle" : "location-off"}
                    size={48}
                    color={checkInActivo ? COLORS.success : COLORS.textLight}
                />
                <Text style={styles.turnoTitle}>
                    {checkInActivo ? 'Turno en curso' : 'Sin turno activo'}
                </Text>
                <Text style={styles.turnoSubtitle}>
                    {checkInActivo
                        ? `Entrada: ${format(new Date(checkInActivo.entrada), 'HH:mm')}`
                        : 'No has iniciado tu turno hoy'
                    }
                </Text>

                {checkInActivo && (
                    <View style={styles.timerContainer}>
                        <MaterialIcons name="schedule" size={32} color={COLORS.primary} />
                        <TiempoTranscurrido entrada={checkInActivo.entrada} style={styles.timerText} />
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.checkButton,
                        { backgroundColor: checkInActivo ? COLORS.secondary : COLORS.success }
                    ]}
                    onPress={checkInActivo ? handleCheckOut : handleCheckIn}
                    disabled={actionLoading}
                >
                    {actionLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.checkButtonText}>
                            {checkInActivo ? 'HACER CHECK-OUT' : 'HACER CHECK-IN'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>RESUMEN DE HOY</Text>
            <ResumenCard
                items={[
                    { icon: 'schedule', label: 'Horas', value: `${resumenHoy.horas.toFixed(1)}h` },
                    { icon: 'attach-money', label: 'Propinas', value: `$${resumenHoy.propinas.toLocaleString()}`, color: COLORS.success }
                ]}
            />

            <View style={styles.repartosHeader}>
                <Text style={styles.sectionTitle}>ÚLTIMOS REPARTOS</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MisRepartos')}>
                    <Text style={styles.verMas}>Ver todos</Text>
                </TouchableOpacity>
            </View>

            {ultimosRepartos.length > 0 ? (
                ultimosRepartos.map(reparto => (
                    <TouchableOpacity
                        key={reparto.id}
                        style={styles.repartoCard}
                        onPress={() => navigation.navigate('DetalleRepartoMozo', { reparto })}
                    >
                        <View style={styles.repartoHeaderInfo}>
                            <MaterialIcons name="calendar-today" size={20} color={COLORS.textLight} />
                            <Text style={styles.repartoFecha}>
                                {format(new Date(reparto.fecha), 'dd MMM yyyy', { locale: es })}
                            </Text>
                        </View>
                        <View style={styles.repartoBody}>
                            <View>
                                <Text style={styles.repartoMonto}>${reparto.montoAsignado.toLocaleString()}</Text>
                                <Text style={styles.repartoHoras}>⏱️ {reparto.horasTrabajadas.toFixed(1)}h trabajadas</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay repartos recientes</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    greeting: {
        fontSize: FONT_SIZE.title,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    role: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    turnoCard: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        elevation: 2,
    },
    turnoCardActive: {
        borderColor: COLORS.success,
        borderWidth: 1,
    },
    turnoTitle: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        marginTop: SPACING.sm,
    },
    turnoSubtitle: {
        color: COLORS.textLight,
        marginBottom: SPACING.md,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    timerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: SPACING.sm,
    },
    checkButton: {
        width: '100%',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    checkButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
    },
    repartosHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    verMas: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    repartoCard: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        elevation: 1,
    },
    repartoHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    repartoFecha: {
        marginLeft: SPACING.sm,
        color: COLORS.textLight,
        fontSize: FONT_SIZE.caption,
    },
    repartoBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    repartoMonto: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    repartoHoras: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textLight,
    }
});
