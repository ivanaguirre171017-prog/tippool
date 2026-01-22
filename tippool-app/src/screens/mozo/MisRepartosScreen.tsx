import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format, subDays, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { FilterButton } from '../../components/common/FilterButton';
import { EmptyState } from '../../components/common/EmptyState';
import { Reparto } from '../../types';

export default function MisRepartosScreen() {
    const navigation = useNavigation<any>();
    const [repartos, setRepartos] = useState<Reparto[]>([]);
    const [filtro, setFiltro] = useState<'todo' | 'semana' | 'mes'>('semana');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalAcumulado, setTotalAcumulado] = useState(0);

    useEffect(() => {
        loadData();
    }, [filtro]);

    const loadData = async () => {
        try {
            setLoading(true);
            let fechaDesde;
            const hoy = new Date();

            switch (filtro) {
                case 'semana':
                    fechaDesde = format(subDays(hoy, 7), 'yyyy-MM-dd');
                    break;
                case 'mes':
                    fechaDesde = format(startOfMonth(hoy), 'yyyy-MM-dd');
                    break;
                case 'todo':
                default:
                    fechaDesde = undefined;
            }

            const data = await repartosApi.getMyRepartos({ fechaDesde });
            setRepartos(data);

            const total = data.reduce((sum, r) => sum + r.montoAsignado, 0);
            setTotalAcumulado(total);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los repartos');
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
        <View style={styles.container}>
            <View style={styles.filtrosContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosScroll}>
                    <FilterButton
                        label="Todo"
                        active={filtro === 'todo'}
                        onPress={() => setFiltro('todo')}
                    />
                    <FilterButton
                        label="Esta semana"
                        active={filtro === 'semana'}
                        onPress={() => setFiltro('semana')}
                    />
                    <FilterButton
                        label="Este mes"
                        active={filtro === 'mes'}
                        onPress={() => setFiltro('mes')}
                    />
                </ScrollView>
            </View>

            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total acumulado</Text>
                <Text style={styles.totalMonto}>${totalAcumulado.toLocaleString()}</Text>
            </View>

            <FlatList
                data={repartos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.repartoCard}
                        onPress={() => navigation.navigate('DetalleRepartoMozo', { reparto: item })}
                    >
                        <View style={styles.cardHeader}>
                            <MaterialIcons name="calendar-today" size={20} color={COLORS.textLight} />
                            <Text style={styles.cardFecha}>
                                {format(new Date(item.fecha), "dd 'de' MMMM yyyy", { locale: es })}
                            </Text>
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={styles.cardMonto}>${item.montoAsignado.toLocaleString()}</Text>

                            <View style={styles.cardDetalles}>
                                <View style={styles.detalleItem}>
                                    <MaterialIcons name="schedule" size={16} color={COLORS.primary} />
                                    <Text style={styles.detalleText}>{item.horasTrabajadas.toFixed(1)}h</Text>
                                </View>

                                <View style={styles.detalleItem}>
                                    <MaterialIcons name="star" size={16} color={COLORS.warning} />
                                    <Text style={styles.detalleText}>{item.puntosRol} puntos</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.verDetalle}>Ver detalle</Text>
                            <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<EmptyState message="No hay repartos en este período" subtext="Aparecerán aquí cuando el encargado los procese" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    filtrosContainer: {
        paddingVertical: SPACING.md,
    },
    filtrosScroll: {
        paddingHorizontal: SPACING.md,
    },
    totalCard: {
        marginHorizontal: SPACING.md,
        padding: SPACING.lg,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    totalLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: FONT_SIZE.caption,
        fontWeight: '600',
    },
    totalMonto: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: SPACING.xl,
    },
    repartoCard: {
        backgroundColor: '#FFF',
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    cardFecha: {
        marginLeft: SPACING.sm,
        color: COLORS.textLight,
        fontSize: FONT_SIZE.caption,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardMonto: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cardDetalles: {
        flexDirection: 'row',
    },
    detalleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: SPACING.md,
    },
    detalleText: {
        marginLeft: 4,
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.xs,
    },
    verDetalle: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
});
