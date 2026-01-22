import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, TextInput as RNTextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { usersApi } from '../../api/users.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

type FormData = {
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    rol: 'ENCARGADO' | 'MOZO';
};

export default function PersonalEditScreen({ route, navigation }: any) {
    const { user } = route.params;
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        defaultValues: {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.rol,
            password: ''
        }
    });

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            const payload: any = { ...data };
            if (!payload.password) {
                delete payload.password;
            }
            delete payload.email; // No se puede cambiar email

            await usersApi.update(user.id, payload);

            Alert.alert(
                '✅ Empleado actualizado',
                'Los cambios se guardaron correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo actualizar el empleado');
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                {/* Email (No editable) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email (no editable)</Text>
                    <RNTextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user.email}
                        editable={false}
                    />
                </View>

                {/* Nombre */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre *</Text>
                    <Controller
                        control={control}
                        name="nombre"
                        rules={{
                            required: 'El nombre es requerido',
                            minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <RNTextInput
                                style={[styles.input, errors.nombre && styles.inputError]}
                                placeholder="Ingrese el nombre"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.nombre && (
                        <Text style={styles.errorText}>{errors.nombre.message}</Text>
                    )}
                </View>

                {/* Apellido */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Apellido *</Text>
                    <Controller
                        control={control}
                        name="apellido"
                        rules={{
                            required: 'El apellido es requerido',
                            minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <RNTextInput
                                style={[styles.input, errors.apellido && styles.inputError]}
                                placeholder="Ingrese el apellido"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.apellido && (
                        <Text style={styles.errorText}>{errors.apellido.message}</Text>
                    )}
                </View>

                {/* Contraseña (Opcional) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cambiar Contraseña (opcional)</Text>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.passwordContainer}>
                                <RNTextInput
                                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                                    placeholder="Dejar vacío para no cambiar"
                                    secureTextEntry={!showPassword}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <MaterialIcons
                                        name={showPassword ? 'visibility' : 'visibility-off'}
                                        size={24}
                                        color={COLORS.textLight}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}
                    <Text style={styles.helperText}>Mínimo 6 caracteres si se desea cambiar</Text>
                </View>

                {/* Rol */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Rol *</Text>
                    <Controller
                        control={control}
                        name="rol"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.rolContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.rolButton,
                                        value === 'ENCARGADO' && styles.rolButtonActive
                                    ]}
                                    onPress={() => onChange('ENCARGADO')}
                                >
                                    <MaterialIcons
                                        name={value === 'ENCARGADO' ? 'radio-button-checked' : 'radio-button-unchecked'}
                                        size={20}
                                        color={value === 'ENCARGADO' ? COLORS.primary : COLORS.textLight}
                                    />
                                    <Text style={[
                                        styles.rolButtonText,
                                        value === 'ENCARGADO' && styles.rolButtonTextActive
                                    ]}>
                                        ENCARGADO
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.rolButton,
                                        value === 'MOZO' && styles.rolButtonActive
                                    ]}
                                    onPress={() => onChange('MOZO')}
                                >
                                    <MaterialIcons
                                        name={value === 'MOZO' ? 'radio-button-checked' : 'radio-button-unchecked'}
                                        size={20}
                                        color={value === 'MOZO' ? COLORS.primary : COLORS.textLight}
                                    />
                                    <Text style={[
                                        styles.rolButtonText,
                                        value === 'MOZO' && styles.rolButtonTextActive
                                    ]}>
                                        MOZO
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                {/* Botón Guardar */}
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>GUARDAR CAMBIOS</Text>
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
    form: {
        padding: SPACING.lg,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZE.body,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text,
    },
    disabledInput: {
        backgroundColor: COLORS.background,
        color: COLORS.textLight,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 10,
        marginTop: 2,
    },
    helperText: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    rolContainer: {
        flexDirection: 'row',
        marginTop: SPACING.xs,
    },
    rolButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        marginRight: 10,
    },
    rolButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
    },
    rolButtonText: {
        marginLeft: 8,
        fontSize: FONT_SIZE.caption,
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    rolButtonTextActive: {
        color: COLORS.primary,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.lg,
        elevation: 2,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.disabled,
    },
    submitButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
    },
});
