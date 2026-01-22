import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { propinasApi } from '../../api/propinas.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { FilterButton } from '../../components/common/FilterButton';
import { EmptyState } from '../../components/common/EmptyState';
import { ResumenCard } from '../../components/common/ResumenCard';
import { Propina } from '../../types';

export default function PropinasListScreen({ navigation }: any) {
    const [propinas, setPropinas] = useState<Propina[]>([]);
    const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'procesadas'>('todas');
    const [metodoFiltro, setMetodoFiltro] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await propinasApi.getAll();
            setPropinas(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las propinas');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const propinasFiltradas = propinas.filter(p => {
        const matchEstado =
            filtro === 'todas' ||
            (filtro === 'pendientes' && !p.procesada) ||
            (filtro === 'procesadas' && p.procesada);

        const matchMetodo = !metodoFiltro || p.metodoPago === metodoFiltro;

        return matchEstado && matchMetodo;
    });

    const totalEfectivo = propinasFiltradas
        .filter(p => p.metodoPago === 'EFECTIVO')
        .reduce((sum, p) => sum + p.monto, 0);

    const totalDigital = propinasFiltradas
        .filter(p => p.metodoPago !== 'EFECTIVO')
        .reduce((sum, p) => sum + p.monto, 0);

    const totalGeneral = propinasFiltradas.reduce((sum, p) => sum + p.monto, 0);

    if (loading && !refreshing) return <LoadingScreen />;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.registrarButton}
                onPress={() => navigation.navigate('RegistrarPropina')}
            >
                <MaterialIcons name="add" size={24} color="#FFF" />
                <Text style={styles.registrarButtonText}>Nueva Propina</Text>
            </TouchableOpacity>

            <View style={styles.summaryContainer}>
                <ResumenCard
                    items={[
                        { label: 'Efectivo', value: `$${totalEfectivo.toLocaleString()}`, icon: 'payments', color: COLORS.success },
                        { label: 'Digital', value: `$${totalDigital.toLocaleString()}`, icon: 'qr-code', color: COLORS.primary },
                        { label: 'Total', value: `$${totalGeneral.toLocaleString()}`, icon: 'account-balance-wallet', color: COLORS.text }
                    ]}
                />
            </View>

            <View style={styles.filtrosContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosScroll}>
                    <FilterButton
                        label="Todas"
                        active={filtro === 'todas'}
                        onPress={() => setFiltro('todas')}
                    />
                    <FilterButton
                        label="Pendientes"
                        active={filtro === 'pendientes'}
                        onPress={() => setFiltro('pendientes')}
                    />
                    <FilterButton
                        label="Procesadas"
                        active={filtro === 'procesadas'}
                        onPress={() => setFiltro('procesadas')}
                    />
                    <View style={styles.divider} />
                    {['EFECTIVO', 'TRANSFERENCIA', 'QR'].map(metodo => (
                        <FilterButton
                            key={metodo}
                            label={metodo}
                            active={metodoFiltro === metodo}
                            onPress={() => setMetodoFiltro(metodoFiltro === metodo ? null : metodo)}
                        />
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={propinasFiltradas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PropinaCard propina={item} />
                )}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<EmptyState message="No hay propinas" subtext="Registra una nueva propina para verla aquí" />}
            />
        </View>
    );
}

const PropinaCard = ({ propina }: { propina: Propina }) => {
    const getIcon = (metodo: string) => {
        switch (metodo) {
            case 'EFECTIVO': return 'payments';
            case 'TRANSFERENCIA': return 'account-balance';
            case 'QR': return 'qr-code';
            default: return 'attach-money';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.methodInfo}>
                    <MaterialIcons name={getIcon(propina.metodoPago)} size={24} color={COLORS.primary} />
                    <View style={styles.textInfo}>
                        <Text style={styles.methodText}>{propina.metodoPago}</Text>
                        <Text style={styles.dateText}>
                            {format(new Date(propina.fecha), "dd MMM, HH:mm'hs'", { locale: es })}
                        </Text>
                    </View>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: propina.procesada ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: propina.procesada ? COLORS.success : COLORS.warning }
                    ]}>
                        {propina.procesada ? 'PROCESADA' : 'PENDIENTE'}
                    </Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.montoText}>${propina.monto.toLocaleString()}</Text>
                <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    registrarButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    registrarButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        marginLeft: SPACING.sm,
    },
    summaryContainer: {
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
    },
    filtrosContainer: {
        paddingVertical: SPACING.sm,
    },
    filtrosScroll: {
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.sm,
    },
    listContainer: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInfo: {
        marginLeft: SPACING.md,
    },
    methodText: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    dateText: {
        fontSize: 10,
        color: COLORS.textLight,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
    },
    montoText: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
    }
});
