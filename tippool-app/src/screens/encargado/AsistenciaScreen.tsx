import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { checkinsApi } from '../../api/checkins.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { TiempoTranscurrido } from '../../components/common/TiempoTranscurrido';
import { CheckIn } from '../../types';

export default function AsistenciaScreen() {
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [asistencias, setAsistencias] = useState<CheckIn[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, [fecha]);

    const loadData = async () => {
        try {
            setLoading(true);
            const fechaStr = format(fecha, 'yyyy-MM-dd');
            const data = await checkinsApi.getByDate(fechaStr);
            setAsistencias(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la asistencia');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFecha(selectedDate);
        }
    };

    if (loading && !refreshing) return <LoadingScreen />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                >
                    <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                    <Text style={styles.dateText}>
                        {format(fecha, "EEEE dd 'de' MMMM", { locale: es })}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.textLight} />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={fecha}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{asistencias.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.success }]}>
                        {asistencias.filter(a => !a.salida).length}
                    </Text>
                    <Text style={styles.statLabel}>En turno</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.textLight }]}>
                        {asistencias.filter(a => a.salida).length}
                    </Text>
                    <Text style={styles.statLabel}>Finalizados</Text>
                </View>
            </View>

            <FlatList
                data={asistencias}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AsistenciaCard asistencia={item} />
                )}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <EmptyState
                        message="Sin asistencia"
                        subtext="No hay registros para la fecha seleccionada"
                    />
                }
            />
        </View>
    );
}

const AsistenciaCard = ({ asistencia }: { asistencia: CheckIn }) => {
    const isEnTurno = !asistencia.salida;

    return (
        <View style={[styles.card, isEnTurno && styles.cardActive]}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {asistencia.user.nombre} {asistencia.user.apellido}
                    </Text>
                    <Text style={styles.userRole}>{asistencia.user.rol}</Text>
                </View>
                {isEnTurno && (
                    <View style={styles.activeBadge}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.activeText}>EN TURNO</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardBody}>
                <View style={styles.timeInfo}>
                    <View style={styles.timeRow}>
                        <MaterialIcons name="login" size={16} color={COLORS.success} />
                        <Text style={styles.timeLabel}>Entrada:</Text>
                        <Text style={styles.timeValue}>
                            {format(new Date(asistencia.entrada), 'HH:mm')}
                        </Text>
                    </View>

                    {asistencia.salida ? (
                        <View style={styles.timeRow}>
                            <MaterialIcons name="logout" size={16} color={COLORS.error} />
                            <Text style={styles.timeLabel}>Salida:</Text>
                            <Text style={styles.timeValue}>
                                {format(new Date(asistencia.salida), 'HH:mm')}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.timeRow}>
                            <MaterialIcons name="schedule" size={16} color={COLORS.primary} />
                            <Text style={styles.timeLabel}>Transcurrido:</Text>
                            <TiempoTranscurrido
                                entrada={asistencia.entrada}
                                style={styles.timerText}
                            />
                        </View>
                    )}
                </View>

                {asistencia.horasTrabajadas !== null && (
                    <View style={styles.hoursContainer}>
                        <Text style={styles.hoursValue}>
                            {asistencia.horasTrabajadas.toFixed(1)}h
                        </Text>
                        <Text style={styles.hoursLabel}>Total</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
        borderRadius: BORDER_RADIUS.sm,
    },
    dateText: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.primary,
        textTransform: 'capitalize',
    },
    statsRow: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        marginBottom: SPACING.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
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
    cardActive: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    userRole: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
        textTransform: 'lowercase',
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    activeText: {
        color: COLORS.success,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    timeInfo: {
        flex: 1,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    timeLabel: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
        marginHorizontal: 4,
        width: 80,
    },
    timeValue: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timerText: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    hoursContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 8,
        borderRadius: BORDER_RADIUS.sm,
        minWidth: 60,
    },
    hoursValue: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    hoursLabel: {
        fontSize: 8,
        color: COLORS.textLight,
        textTransform: 'uppercase',
    }
});
