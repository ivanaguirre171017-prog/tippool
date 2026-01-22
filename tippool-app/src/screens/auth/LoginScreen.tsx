import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Surface, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const login = useAuthStore(state => state.login);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await authApi.login(data.email, data.password);
            await login(response.user, response.token);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Credenciales incorrectas o error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Surface style={styles.logoContainer} elevation={4}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2636/2636306.png' }}
                        style={styles.logo}
                    />
                </Surface>
                <Text style={styles.title}>TipPool</Text>
                <Text style={styles.subtitle}>Gestión de propinas simple</Text>
            </View>

            <Surface style={styles.card} elevation={2}>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <Text style={styles.instructions}>Inicia sesión para continuar</Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Email"
                            value={value}
                            onChangeText={onChange}
                            error={errors.email?.message}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Contraseña"
                            value={value}
                            onChangeText={onChange}
                            error={errors.password?.message}
                            secureTextEntry={secureTextEntry}
                            right={
                                <TextInput.Icon
                                    icon={secureTextEntry ? "eye" : "eye-off"}
                                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                                />
                            }
                        />
                    )}
                />

                <Button
                    title="INICIAR SESIÓN"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    style={styles.loginButton}
                />
            </Surface>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    logo: {
        width: 50,
        height: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
    },
    card: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.card,
    },
    welcomeText: {
        fontSize: FONT_SIZE.title,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    instructions: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
        marginBottom: SPACING.lg,
    },
    loginButton: {
        marginTop: SPACING.md,
        height: 55,
    }
});
