import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { propinasApi } from '../../api/propinas.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ResumenCard } from '../../components/common/ResumenCard';

export default function DashboardEncargadoScreen({ navigation }: any) {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        pendingAmount: 0,
        pendingCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const pending = await propinasApi.getPendientes();
            const amount = pending.reduce((acc, curr) => acc + curr.monto, 0);
            setStats({
                pendingAmount: amount,
                pendingCount: pending.length
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading && !refreshing) return <LoadingScreen />;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>¡Hola, {user?.nombre}! 👋</Text>
                    <Text style={styles.subtitle}>Gestiona el pozo de hoy</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                    <Avatar.Text
                        size={40}
                        label={`${user?.nombre[0]}${user?.apellido[0]}`}
                        style={{ backgroundColor: COLORS.primary }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.mainCard}>
                <Text style={styles.cardLabel}>PROPINAS PENDIENTES</Text>
                <Text style={styles.cardValue}>${stats.pendingAmount.toLocaleString()}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{stats.pendingCount} propinas acumuladas</Text>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('Propinas', { screen: 'RegistrarPropina' })}
                    >
                        <MaterialIcons name="add-circle" size={24} color={COLORS.primary} />
                        <Text style={styles.actionText}>Registrar</Text>
                    </TouchableOpacity>
                    <View style={styles.vDivider} />
                    <TouchableOpacity
                        style={[styles.actionBtn, stats.pendingCount === 0 && { opacity: 0.5 }]}
                        onPress={() => navigation.navigate('Repartos', { screen: 'EjecutarReparto' })}
                        disabled={stats.pendingCount === 0}
                    >
                        <MaterialIcons name="calculate" size={24} color={COLORS.secondary} />
                        <Text style={styles.actionText}>Repartir</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACCESO RÁPIDO</Text>
                <View style={styles.grid}>
                    <ShortcutItem
                        icon="people"
                        label="Personal"
                        color="#6C63FF"
                        onPress={() => navigation.navigate('Personal')}
                    />
                    <ShortcutItem
                        icon="history"
                        label="Historial"
                        color="#FF6584"
                        onPress={() => navigation.navigate('Propinas')}
                    />
                    <ShortcutItem
                        icon="bar-chart"
                        label="Estadísticas"
                        color="#4CAF50"
                        onPress={() => navigation.navigate('Estadisticas')}
                    />
                    <ShortcutItem
                        icon="event-note"
                        label="Asistencia"
                        color="#FF9800"
                        onPress={() => navigation.navigate('Repartos')}
                    />
                </View>
            </View>

            <ResumenCard
                title="Estado del Sistema"
                items={[
                    { label: 'Procesando', value: 'OK', icon: 'check-circle', color: COLORS.success },
                    { label: 'Servidor', value: 'En línea', icon: 'cloud-done', color: COLORS.primary }
                ]}
            />

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const ShortcutItem = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <MaterialIcons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.gridLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingTop: 40,
    },
    greeting: {
        fontSize: FONT_SIZE.title,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
    },
    mainCard: {
        backgroundColor: '#FFF',
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        letterSpacing: 1,
    },
    cardValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginVertical: SPACING.md,
    },
    badge: {
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: SPACING.xl,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    actionsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        width: '100%',
        paddingTop: SPACING.lg,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: COLORS.text,
        fontSize: FONT_SIZE.body,
    },
    vDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.border,
    },
    section: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.md,
        marginLeft: SPACING.sm,
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.md,
        elevation: 1,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridLabel: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.text,
    }
});
