import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ResumenCard } from '../../components/common/ResumenCard';

export default function RepartoDetalleScreen({ route }: any) {
    const { id } = route.params;
    const [detalle, setDetalle] = useState<any>(null);
    const [participantes, setParticipantes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await repartosApi.getDetail(id);
            setDetalle(data);

            // Cargar todos los participantes de esa fecha
            const fechaStr = format(new Date(data.fecha), 'yyyy-MM-dd');
            const history = await repartosApi.getAllHistory(fechaStr);
            setParticipantes(history);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el detalle del reparto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.fecha}>
                    {format(new Date(detalle.fecha + 'T12:00:00'), "EEEE dd 'de' MMMM 'de' yyyy", { locale: es })}
                </Text>
            </View>

            <ResumenCard
                items={[
                    { label: 'Pozo Total', value: `$${detalle.pozoTotal.toLocaleString()}`, icon: 'payments', color: COLORS.success },
                    { label: 'Empleados', value: detalle.numeroEmpleados.toString(), icon: 'people', color: COLORS.primary },
                    { label: 'Puntos', value: detalle.totalPuntos.toFixed(1), icon: 'star', color: COLORS.warning }
                ]}
            />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DESGLOSE DE PROPINAS</Text>
                <View style={styles.card}>
                    {Object.entries(detalle.desglosePropinas).map(([metodo, monto]: [any, any]) => (
                        <View key={metodo} style={styles.row}>
                            <View style={styles.rowLabel}>
                                <MaterialIcons
                                    name={metodo === 'EFECTIVO' ? 'payments' : (metodo === 'QR' ? 'qr-code' : 'account-balance')}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                                <Text style={styles.labelText}>{metodo}</Text>
                            </View>
                            <Text style={styles.valueText}>${monto.toLocaleString()}</Text>
                        </View>
                    ))}
                    <Divider style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={[styles.labelText, { fontWeight: 'bold' }]}>Total recaudado</Text>
                        <Text style={[styles.valueText, { color: COLORS.success, fontSize: FONT_SIZE.subtitle }]}>
                            ${detalle.pozoTotal.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>REPARTO POR EMPLEADO</Text>
                {participantes.map((p) => (
                    <View key={p.id} style={styles.participanteCard}>
                        <View style={styles.pHeader}>
                            <Avatar.Text
                                size={40}
                                label={`${p.user.nombre[0]}${p.user.apellido[0]}`}
                                style={{ backgroundColor: p.user.rol === 'ENCARGADO' ? COLORS.primary : COLORS.secondary }}
                            />
                            <View style={styles.pInfo}>
                                <Text style={styles.pNombre}>{p.user.nombre} {p.user.apellido}</Text>
                                <Text style={styles.pRol}>{p.user.rol}</Text>
                            </View>
                            <View style={styles.pMontoContainer}>
                                <Text style={styles.pMonto}>${p.montoAsignado.toLocaleString()}</Text>
                            </View>
                        </View>
                        <View style={styles.pDetails}>
                            <View style={styles.pDetailItem}>
                                <MaterialIcons name="schedule" size={14} color={COLORS.textLight} />
                                <Text style={styles.pDetailText}>{p.horasTrabajadas.toFixed(1)}h</Text>
                            </View>
                            <View style={styles.pDetailItem}>
                                <MaterialIcons name="star" size={14} color={COLORS.warning} />
                                <Text style={styles.pDetailText}>{p.puntosRol} pts/h</Text>
                            </View>
                            <View style={styles.pDetailItem}>
                                <MaterialIcons name="calculate" size={14} color={COLORS.primary} />
                                <Text style={styles.pDetailText}>{(p.horasTrabajadas * p.puntosRol).toFixed(1)} total</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.md,
        alignItems: 'center',
    },
    fecha: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
        textTransform: 'capitalize',
    },
    section: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        marginLeft: SPACING.sm,
        color: COLORS.text,
    },
    valueText: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    divider: {
        marginVertical: 8,
    },
    participanteCard: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        elevation: 1,
    },
    pHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    pNombre: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    pRol: {
        fontSize: 10,
        color: COLORS.textLight,
        textTransform: 'lowercase',
    },
    pMontoContainer: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    pMonto: {
        color: COLORS.success,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
    },
    pDetails: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        justifyContent: 'space-around',
    },
    pDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pDetailText: {
        marginLeft: 4,
        fontSize: 10,
        color: COLORS.textLight,
    }
});
