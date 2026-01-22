import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';

export default function PerfilScreen() {
    const { user, logout } = useAuthStore();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text size={80} label={user?.nombre.substring(0, 2).toUpperCase() || "US"} style={{ backgroundColor: COLORS.primary }} />
                <Text variant="headlineSmall" style={styles.name}>{user?.nombre} {user?.apellido}</Text>
                <Text variant="bodyMedium" style={styles.email}>{user?.email}</Text>
                <Text variant="labelLarge" style={styles.role}>{user?.rol}</Text>
            </View>

            <Button
                mode="outlined"
                onPress={() => logout()}
                icon="logout"
                style={styles.logoutButton}
                textColor={COLORS.error}
            >
                Cerrar Sesión
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: COLORS.background,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    name: {
        marginTop: 15,
        fontWeight: 'bold',
    },
    email: {
        color: COLORS.textLight,
        marginTop: 5,
    },
    role: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: COLORS.border,
        borderRadius: 15,
        overflow: 'hidden'
    },
    logoutButton: {
        width: '100%',
        borderColor: COLORS.error,
    }
});
