import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function DetalleRepartoMozoScreen({ route }: any) {
    const { reparto } = route.params;
    const [detalleCompleto, setDetalleCompleto] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerDetalle = async () => {
            try {
                const data = await repartosApi.getDetail(reparto.id);
                setDetalleCompleto(data);
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el detalle');
            } finally {
                setLoading(false);
            }
        };

        obtenerDetalle();
    }, [reparto.id]);

    if (loading) return <LoadingScreen />;

    const totalPuntosTu = (reparto.puntosRol * reparto.horasTrabajadas);
    const porcentaje = ((totalPuntosTu / detalleCompleto.totalPuntos) * 100).toFixed(2);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.fecha}>
                {format(new Date(reparto.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>TU PARTE</Text>
                <View style={styles.montoCard}>
                    <Text style={styles.recibisteLabel}>Recibiste</Text>
                    <Text style={styles.montoGrande}>${reparto.montoAsignado.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CÓMO SE CALCULÓ</Text>
                <View style={styles.card}>
                    <CalculoRow
                        icon="schedule"
                        label="Horas trabajadas"
                        value={`${reparto.horasTrabajadas.toFixed(1)}h`}
                    />
                    <CalculoRow
                        icon="star"
                        label="Multiplicador por rol (Mozo)"
                        value={`${reparto.puntosRol}x`}
                    />
                    <View style={styles.divider} />
                    <CalculoRow
                        icon="calculate"
                        label="Total de puntos"
                        value={totalPuntosTu.toFixed(1)}
                        highlight
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DEL POZO TOTAL</Text>
                <View style={styles.card}>
                    <PozoRow
                        label="Pozo repartido"
                        value={`$${detalleCompleto.pozoTotal.toLocaleString()}`}
                    />
                    <PozoRow
                        label="Empleados participantes"
                        value={detalleCompleto.numeroEmpleados}
                    />
                    <PozoRow
                        label="Total de puntos"
                        value={detalleCompleto.totalPuntos.toFixed(1)}
                    />
                    <View style={styles.divider} />
                    <PozoRow
                        label="Tu porcentaje"
                        value={`${porcentaje}%`}
                        highlight
                    />
                    <Text style={styles.explicacion}>
                        ({totalPuntosTu.toFixed(1)} puntos / {detalleCompleto.totalPuntos.toFixed(1)} puntos totales)
                    </Text>
                </View>
            </View>

            {detalleCompleto.desglosePropinas && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROPINAS DEL DÍA</Text>
                    <View style={styles.card}>
                        {Object.entries(detalleCompleto.desglosePropinas).map(([metodo, monto]: [any, any]) => (
                            <PropinaRow
                                key={metodo}
                                metodo={metodo}
                                monto={monto}
                            />
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const CalculoRow = ({ icon, label, value, highlight }: any) => (
    <View style={styles.row}>
        <View style={styles.rowLabel}>
            <MaterialIcons name={icon} size={20} color={highlight ? COLORS.primary : COLORS.textLight} />
            <Text style={[styles.labelText, highlight && styles.highlightText]}>{label}</Text>
        </View>
        <Text style={[styles.valueText, highlight && styles.highlightValue]}>{value}</Text>
    </View>
);

const PozoRow = ({ label, value, highlight }: any) => (
    <View style={styles.row}>
        <Text style={[styles.labelText, highlight && styles.highlightText]}>{label}</Text>
        <Text style={[styles.valueText, highlight && styles.highlightValue]}>{value}</Text>
    </View>
);

const PropinaRow = ({ metodo, monto }: any) => {
    const getIcon = (m: string) => {
        switch (m) {
            case 'EFECTIVO': return 'payments';
            case 'TRANSFERENCIA': return 'account-balance';
            case 'QR': return 'qr-code';
            default: return 'attach-money';
        }
    };

    return (
        <View style={styles.row}>
            <View style={styles.rowLabel}>
                <MaterialIcons name={getIcon(metodo)} size={20} color={COLORS.success} />
                <Text style={styles.labelText}>{metodo}</Text>
            </View>
            <Text style={styles.valueText}>${monto.toLocaleString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    fecha: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginVertical: SPACING.md,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    montoCard: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    recibisteLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: FONT_SIZE.caption,
    },
    montoGrande: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
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
        fontSize: FONT_SIZE.body,
    },
    valueText: {
        fontWeight: 'bold',
        color: COLORS.text,
        fontSize: FONT_SIZE.body,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 4,
    },
    highlightText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    highlightValue: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.subtitle,
    },
    explicacion: {
        fontSize: 10,
        color: COLORS.textLight,
        textAlign: 'right',
        marginTop: 4,
    }
});
