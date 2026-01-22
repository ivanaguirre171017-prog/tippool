import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import { checkinsApi } from '../../api/checkins.api';
import { repartosApi } from '../../api/repartos.api';
import { usersApi } from '../../api/users.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import api from '../../api/axios.config';
import { useNavigation } from '@react-navigation/native';

export default function PerfilScreen() {
    const navigation = useNavigation<any>();
    const { user, logout, setUser } = useAuthStore();
    const [stats, setStats] = useState({
        hours: 0,
        earnings: 0,
        activeStaff: 0,
        totalToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            if (user?.rol === 'MOZO') {
                const checkins = await checkinsApi.getMyHistory();
                const repartos = await repartosApi.getMyRepartos();

                const totalHours = checkins.reduce((acc, curr) => acc + (curr.horasTrabajadas || 0), 0);
                const totalEarnings = repartos.reduce((acc, curr) => acc + curr.montoAsignado, 0);

                setStats(prev => ({ ...prev, hours: totalHours, earnings: totalEarnings }));
            } else {
                const users = await usersApi.getAll();
                const activeCount = users.filter(u => u.activo).length;

                const today = new Date().toISOString().split('T')[0];
                const history = await repartosApi.getAllHistory(today);
                const todayTotal = history.reduce((acc, curr) => acc + curr.montoAsignado, 0);

                setStats(prev => ({ ...prev, activeStaff: activeCount, totalToday: todayTotal }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
        });

        if (!result.canceled) {
            uploadPhoto(result.assets[0].uri);
        }
    };

    const uploadPhoto = async (uri: string) => {
        try {
            setUploading(true);
            const formData = new FormData();

            // Extract file extension
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('foto', {
                uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);

            const { data } = await api.post('/users/upload-foto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.data?.url) {
                setUser({ ...user, fotoPerfil: data.data.url });
                Alert.alert('✅ Éxito', 'Foto de perfil actualizada');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas salir de Tippool?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "SÍ, SALIR",
                    onPress: logout,
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) return <LoadingScreen />;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerBackground}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={handleSelectPhoto} disabled={uploading} style={styles.avatarContainer}>
                        {uploading ? (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={{ color: COLORS.primary }}>Subiendo...</Text>
                            </View>
                        ) : user?.fotoPerfil ? (
                            <Image source={{ uri: user.fotoPerfil }} style={styles.avatar} />
                        ) : (
                            <Avatar.Text
                                size={100}
                                label={`${user?.nombre[0]}${user?.apellido[0]}`}
                                style={styles.avatar}
                            />
                        )}
                        <View style={styles.cameraIcon}>
                            <MaterialIcons name="camera-alt" size={20} color="#FFF" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{user?.nombre} {user?.apellido}</Text>
                        <View style={styles.roleBadge}>
                            <MaterialIcons name="verified-user" size={14} color="#FFF" />
                            <Text style={styles.roleText}>{user?.rol}</Text>
                        </View>
                        <Text style={styles.email}>{user?.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    {user?.rol === 'MOZO' ? (
                        <>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{stats.hours.toFixed(1)}h</Text>
                                <Text style={styles.statLabel}>Horas totales</Text>
                            </View>
                            <View style={[styles.statBox, styles.statBoxPrimary]}>
                                <Text style={[styles.statValue, { color: '#FFF' }]}>
                                    ${stats.earnings.toLocaleString()}
                                </Text>
                                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>
                                    Total ganado
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{stats.activeStaff}</Text>
                                <Text style={styles.statLabel}>Personal activo</Text>
                            </View>
                            <View style={[styles.statBox, styles.statBoxPrimary]}>
                                <Text style={[styles.statValue, { color: '#FFF' }]}>
                                    ${stats.totalToday.toLocaleString()}
                                </Text>
                                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>
                                    Repartido hoy
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AJUSTES DE CUENTA</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Notificaciones')}
                    >
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="notifications-none" size={24} color={COLORS.textLight} />
                            <Text style={styles.menuText}>Notificaciones</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Privacidad')}
                    >
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="lock-outline" size={24} color={COLORS.textLight} />
                            <Text style={styles.menuText}>Privacidad y Seguridad</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Soporte')}
                    >
                        <View style={styles.menuLabel}>
                            <MaterialIcons name="help-outline" size={24} color={COLORS.textLight} />
                            <Text style={styles.menuText}>Soporte Técnico</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <MaterialIcons name="logout" size={24} color={COLORS.error} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Tippool v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerBackground: {
        backgroundColor: COLORS.primary,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileHeader: {
        padding: SPACING.xl,
        alignItems: 'center',
        marginTop: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        elevation: 10,
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.secondary,
        padding: 6,
        borderRadius: 15,
        elevation: 12,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    headerInfo: {
        alignItems: 'center',
    },
    name: {
        fontSize: FONT_SIZE.title,
        fontWeight: 'bold',
        color: '#FFF',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 4,
    },
    roleText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 6,
        textTransform: 'lowercase',
    },
    email: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: FONT_SIZE.caption,
        marginTop: 8,
    },
    content: {
        paddingHorizontal: SPACING.lg,
        marginTop: -30,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: SPACING.xl,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        elevation: 4,
        alignItems: 'center',
    },
    statBoxPrimary: {
        backgroundColor: COLORS.secondary,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        elevation: 2,
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.md,
        marginLeft: SPACING.sm,
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
    },
    menuLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        marginLeft: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.error,
        marginBottom: SPACING.xl,
    },
    logoutText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textLight,
        fontSize: 10,
        marginBottom: 40,
    }
});
