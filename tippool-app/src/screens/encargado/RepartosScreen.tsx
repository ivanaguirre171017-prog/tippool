import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { propinasApi } from '../../api/propinas.api';
import { repartosApi } from '../../api/repartos.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function RepartosScreen({ navigation }: any) {
    const [pendingAmount, setPendingAmount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [metodos, setMetodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const pending = await propinasApi.getPendientes();
            const total = pending.reduce((acc, curr) => acc + curr.monto, 0);
            setPendingAmount(total);
            setPendingCount(pending.length);

            // Agrupar por método para el resumen
            const grouped = pending.reduce((acc: any, curr) => {
                acc[curr.metodoPago] = (acc[curr.metodoPago] || 0) + curr.monto;
                return acc;
            }, {});
            setMetodos(Object.entries(grouped));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = async () => {
        Alert.alert(
            "🚀 Ejecutar Reparto",
            `¿Estás seguro que quieres distribuir $${pendingAmount.toLocaleString()} entre el personal activo?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "SÍ, REPARTIR AHORA",
                    onPress: async () => {
                        try {
                            setCalculating(true);
                            const today = new Date().toISOString().split('T')[0];
                            await repartosApi.calculate(today);
                            Alert.alert('✅ Éxito', 'El reparto se ha procesado correctamente.');
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.error || 'No hay empleados con turno finalizado hoy o no hay propinas pendientes.');
                        } finally {
                            setCalculating(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <LoadingScreen />;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Cierre de Jornada</Text>
                <Text style={styles.subtitle}>Distribución de propinas acumuladas</Text>

                <View style={styles.pozoCard}>
                    <Text style={styles.pozoLabel}>POZO TOTAL A REPARTIR</Text>
                    <Text style={styles.pozoValue}>${pendingAmount.toLocaleString()}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingCount} propinas</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>VALORES POR MÉTODO</Text>
                    <View style={styles.metodosCard}>
                        {metodos.length > 0 ? metodos.map(([metodo, monto]) => (
                            <View key={metodo} style={styles.metodoRow}>
                                <View style={styles.metodoInfo}>
                                    <MaterialIcons
                                        name={metodo === 'EFECTIVO' ? 'payments' : (metodo === 'QR' ? 'qr-code' : 'account-balance')}
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.metodoName}>{metodo}</Text>
                                </View>
                                <Text style={styles.metodoValue}>${monto.toLocaleString()}</Text>
                            </View>
                        )) : (
                            <Text style={styles.noData}>No hay propinas pendientes</Text>
                        )}
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <MaterialIcons name="info" size={24} color={COLORS.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Consideraciones:</Text>
                        <Text style={styles.infoText}>
                            • Solo participan empleados con check-out hoy.{"\n"}
                            • El cálculo es proporcional a las horas y el rol.{"\n"}
                            • Esta acción es irreversible y marca las propinas como procesadas.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.btnRepatir,
                        (pendingCount === 0 || calculating) && styles.btnDisabled
                    ]}
                    onPress={handleCalculate}
                    disabled={pendingCount === 0 || calculating}
                >
                    {calculating ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <MaterialIcons name="send" size={24} color="#FFF" />
                            <Text style={styles.btnText}>CONFIRMAR Y REPARTIR</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZE.title,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
        marginBottom: SPACING.xl,
    },
    pozoCard: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        elevation: 4,
        marginBottom: SPACING.xl,
    },
    pozoLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    pozoValue: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: SPACING.sm,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    metodosCard: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        elevation: 1,
    },
    metodoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    metodoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metodoName: {
        marginLeft: 10,
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
    },
    metodoValue: {
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.1)',
        marginBottom: SPACING.xl,
    },
    infoContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    infoTitle: {
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        color: COLORS.textLight,
    },
    btnRepatir: {
        flexDirection: 'row',
        backgroundColor: COLORS.success,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    btnDisabled: {
        backgroundColor: COLORS.disabled,
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        marginLeft: 10,
    },
    noData: {
        textAlign: 'center',
        color: COLORS.textLight,
        padding: SPACING.md,
    }
});
