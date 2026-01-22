import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { Reparto } from '../../types';

interface GroupedReparto {
    fecha: string;
    total: number;
    empleados: number;
    idReferencia: string;
}

export default function RepartosListScreen() {
    const navigation = useNavigation<any>();
    const [repartosAgrupados, setRepartosAgrupados] = useState<GroupedReparto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await repartosApi.getAllHistory();

            // Agrupar por fecha
            const grouped = data.reduce((acc: any, curr: Reparto) => {
                const dateKey = format(new Date(curr.fecha), 'yyyy-MM-dd');
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        fecha: dateKey,
                        total: 0,
                        empleados: new Set(),
                        idReferencia: curr.id // Usamos uno como referencia para el detalle
                    };
                }
                acc[dateKey].total += curr.montoAsignado;
                acc[dateKey].empleados.add(curr.userId);
                return acc;
            }, {});

            const result: GroupedReparto[] = Object.values(grouped).map((g: any) => ({
                fecha: g.fecha,
                total: g.total,
                empleados: g.empleados.size,
                idReferencia: g.idReferencia
            }));

            setRepartosAgrupados(result.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el historial de repartos');
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
            <View style={styles.header}>
                <Text style={styles.title}>Historial de Repartos</Text>
                <TouchableOpacity
                    style={styles.calcularButton}
                    onPress={() => navigation.navigate('EjecutarReparto')}
                >
                    <MaterialIcons name="calculate" size={20} color="#FFF" />
                    <Text style={styles.calcularText}>Nuevo Reparto</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={repartosAgrupados}
                keyExtractor={(item) => item.fecha}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('RepartoDetalle', { id: item.idReferencia })}
                    >
                        <View style={styles.cardHeader}>
                            <MaterialIcons name="event" size={20} color={COLORS.textLight} />
                            <Text style={styles.cardFecha}>
                                {format(new Date(item.fecha + 'T12:00:00'), "EEEE dd 'de' MMMM", { locale: es })}
                            </Text>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.mainInfo}>
                                <Text style={styles.montoLabel}>Total Repartido</Text>
                                <Text style={styles.montoValue}>${item.total.toLocaleString()}</Text>
                            </View>

                            <View style={styles.sideInfo}>
                                <View style={styles.statRow}>
                                    <MaterialIcons name="people" size={16} color={COLORS.primary} />
                                    <Text style={styles.statText}>{item.empleados} emp.</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={COLORS.primary} />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<EmptyState message="No hay repartos registrados" subtext="Los repartos aparecerán aquí después de procesarlos" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    calcularButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: BORDER_RADIUS.sm,
    },
    calcularText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    listContainer: {
        padding: SPACING.md,
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
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    cardFecha: {
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainInfo: {
        flex: 1,
    },
    montoLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        textTransform: 'uppercase',
    },
    montoValue: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    sideInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.sm,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statText: {
        marginLeft: 4,
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
    }
});
