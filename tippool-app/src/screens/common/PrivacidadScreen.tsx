import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import api from '../../api/axios.config';

export default function PrivacidadScreen() {
    const { user, logout } = useAuthStore();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCambiarPassword = async () => {
        if (!passwordActual || !passwordNueva || !passwordConfirm) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (passwordNueva !== passwordConfirm) {
            Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            await api.post('/auth/cambiar-password', {
                passwordActual,
                passwordNueva
            });
            Alert.alert('✅ Éxito', 'Contraseña actualizada correctamente');
            setShowPasswordModal(false);
            setPasswordActual('');
            setPasswordNueva('');
            setPasswordConfirm('');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarCuenta = () => {
        Alert.alert(
            '⚠️ Eliminar Cuenta',
            '¿Estás seguro? Esta acción eliminará permanentemente todos tus datos y no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'ELIMINAR MI CUENTA',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete('/users/mi-cuenta');
                            logout();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la cuenta');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>SEGURIDAD</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowPasswordModal(true)}>
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="lock" size={24} color={COLORS.primary} />
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText}>Cambiar Contraseña</Text>
                                <Text style={styles.menuSubtext}>Última actualización: hace poco</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>PRIVACIDAD</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Info', 'Política de privacidad en desarrollo')}>
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="description" size={24} color={COLORS.textLight} />
                            <Text style={styles.menuText}>Política de Privacidad</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Info', 'Términos y condiciones en desarrollo')}>
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="gavel" size={24} color={COLORS.textLight} />
                            <Text style={styles.menuText}>Términos y Condiciones</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>CUENTA</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={logout}>
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="logout" size={24} color={COLORS.primary} />
                            <Text style={styles.menuText}>Cerrar Sesión</Text>
                        </View>
                    </TouchableOpacity>
                    {user?.rol === 'MOZO' && (
                        <>
                            <Divider />
                            <TouchableOpacity style={styles.menuItem} onPress={handleEliminarCuenta}>
                                <View style={styles.menuLabel}>
                                    <MaterialIcons name="delete-forever" size={24} color={COLORS.error} />
                                    <Text style={[styles.menuText, { color: COLORS.error }]}>Eliminar mi Cuenta</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <Modal animationType="slide" transparent={true} visible={showPasswordModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                                <MaterialIcons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña actual"
                            secureTextEntry
                            value={passwordActual}
                            onChangeText={setPasswordActual}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nueva contraseña"
                            secureTextEntry
                            value={passwordNueva}
                            onChangeText={setPasswordNueva}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar nueva contraseña"
                            secureTextEntry
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                        />

                        <Button
                            title="ACTUALIZAR"
                            onPress={handleCambiarPassword}
                            loading={loading}
                            style={styles.modalButton}
                        />
                    </View>
                </View>
            </Modal>
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
        elevation: 2,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    menuLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: SPACING.md,
    },
    menuText: {
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
    },
    menuSubtext: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: SPACING.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        fontSize: FONT_SIZE.body,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalButton: {
        marginTop: SPACING.md,
        height: 56,
        borderRadius: 12,
    },
});
