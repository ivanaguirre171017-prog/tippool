import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, TextInput as RNTextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { propinasApi } from '../../api/propinas.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

type FormData = {
    monto: string;
    metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'QR';
};

export default function PropinasScreen({ navigation }: any) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>({
        defaultValues: {
            metodoPago: 'EFECTIVO',
            monto: ''
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            await propinasApi.create({
                monto: parseFloat(data.monto),
                metodoPago: data.metodoPago
            });

            Alert.alert(
                '✅ Éxito',
                'Propina registrada correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            reset();
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo registrar la propina');
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.title}>Nueva Propina</Text>
                <Text style={styles.subtitle}>Registra los ingresos para el pozo del día</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Monto Recibido ($) *</Text>
                    <Controller
                        control={control}
                        name="monto"
                        rules={{
                            required: 'El monto es requerido',
                            validate: (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0 || 'Monto inválido'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <RNTextInput
                                style={[styles.montoInput, errors.monto && styles.inputError]}
                                placeholder="0.00"
                                placeholderTextColor="rgba(0,0,0,0.2)"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                autoFocus
                            />
                        )}
                    />
                    {errors.monto && (
                        <Text style={styles.errorText}>{errors.monto.message}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Método de Pago *</Text>
                    <Controller
                        control={control}
                        name="metodoPago"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.metodoContainer}>
                                <MetodoButton
                                    label="EFECTIVO"
                                    icon="payments"
                                    active={value === 'EFECTIVO'}
                                    onPress={() => onChange('EFECTIVO')}
                                />
                                <MetodoButton
                                    label="TRANSF."
                                    icon="account-balance"
                                    active={value === 'TRANSFERENCIA'}
                                    onPress={() => onChange('TRANSFERENCIA')}
                                />
                                <MetodoButton
                                    label="QR"
                                    icon="qr-code"
                                    active={value === 'QR'}
                                    onPress={() => onChange('QR')}
                                />
                            </View>
                        )}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <MaterialIcons name="save" size={24} color="#FFF" />
                            <Text style={styles.submitButtonText}>REGISTRAR PROPINA</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const MetodoButton = ({ label, icon, active, onPress }: any) => (
    <TouchableOpacity
        style={[styles.metodoButton, active && styles.metodoButtonActive]}
        onPress={onPress}
    >
        <MaterialIcons
            name={icon}
            size={24}
            color={active ? COLORS.primary : COLORS.textLight}
        />
        <Text style={[styles.metodoLabel, active && styles.metodoLabelActive]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    form: {
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
    inputGroup: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    montoInput: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    metodoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metodoButton: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginHorizontal: 4,
    },
    metodoButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
    },
    metodoLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginTop: 4,
    },
    metodoLabelActive: {
        color: COLORS.primary,
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xl,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.disabled,
    },
    submitButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        marginLeft: 10,
    },
});
