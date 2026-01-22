import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE } from '../../constants/design';
import Button from '../../components/common/Button';
import api from '../../api/axios.config';

export default function NotificacionesScreen() {
    const [preferencias, setPreferencias] = useState({
        pushEnabled: true,
        nuevoReparto: true,
        propinaRegistrada: true,
        checkinsEmpleados: false,
        sonido: true,
        vibracion: true
    });

    const [loading, setLoading] = useState(false);

    const guardarPreferencias = async () => {
        try {
            setLoading(true);
            await api.patch('/users/preferencias-notificaciones', preferencias);
            Alert.alert('✅ Éxito', 'Preferencias guardadas correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudieron guardar las preferencias');
        } finally {
            setLoading(false);
        }
    };

    const ToggleRow = ({ label, value, onChange, icon }: any) => (
        <View style={styles.row}>
            <View style={styles.labelContainer}>
                <MaterialIcons name={icon} size={22} color={COLORS.textLight} style={styles.icon} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#767577', true: COLORS.primary + '50' }}
                thumbColor={value ? COLORS.primary : '#f4f3f4'}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <ToggleRow
                        label="Notificaciones push"
                        icon="notifications-active"
                        value={preferencias.pushEnabled}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, pushEnabled: val })}
                    />
                </View>

                <Text style={styles.sectionTitle}>ALERTAS</Text>
                <View style={styles.section}>
                    <ToggleRow
                        label="Nuevo reparto calculado"
                        icon="account-balance-wallet"
                        value={preferencias.nuevoReparto}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, nuevoReparto: val })}
                    />
                    <Divider />
                    <ToggleRow
                        label="Propina registrada"
                        icon="attach-money"
                        value={preferencias.propinaRegistrada}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, propinaRegistrada: val })}
                    />
                    <Divider />
                    <ToggleRow
                        label="Check-in de empleados"
                        icon="person-pin"
                        value={preferencias.checkinsEmpleados}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, checkinsEmpleados: val })}
                    />
                </View>

                <Text style={styles.sectionTitle}>SONIDOS</Text>
                <View style={styles.section}>
                    <ToggleRow
                        label="Reproducir sonido"
                        icon="volume-up"
                        value={preferencias.sonido}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, sonido: val })}
                    />
                    <Divider />
                    <ToggleRow
                        label="Vibración"
                        icon="vibration"
                        value={preferencias.vibracion}
                        onChange={(val: boolean) => setPreferencias({ ...preferencias, vibracion: val })}
                    />
                </View>

                <Button
                    title="GUARDAR PREFERENCIAS"
                    onPress={guardarPreferencias}
                    loading={loading}
                    style={styles.saveButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        elevation: 2,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.sm,
    },
    label: {
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
    },
    saveButton: {
        marginTop: SPACING.md,
        borderRadius: 12,
        height: 56,
    }
});
