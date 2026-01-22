import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { checkinsApi } from '../../api/checkins.api';
import { CheckIn } from '../../types';

export default function CheckInButton() {
    const [activeCheckIn, setActiveCheckIn] = useState<CheckIn | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const checkin = await checkinsApi.getActiveCheckIn();
            setActiveCheckIn(checkin);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = async () => {
        setProcessing(true);
        try {
            if (activeCheckIn) {
                // Check out
                await checkinsApi.exit();
                Alert.alert('Éxito', 'Has registrado tu salida.');
                setActiveCheckIn(undefined);
            } else {
                // Check in
                const newCheckIn = await checkinsApi.entry();
                Alert.alert('Éxito', 'Has registrado tu entrada.');
                setActiveCheckIn(newCheckIn);
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al procesar solicitud');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <ActivityIndicator color={COLORS.primary} />;

    const isCheckedIn = !!activeCheckIn;

    return (
        <TouchableOpacity onPress={handlePress} disabled={processing}>
            <Surface style={[styles.container, isCheckedIn ? styles.active : styles.inactive]} elevation={4}>
                {processing ? (
                    <ActivityIndicator color="white" size="large" />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name={isCheckedIn ? "door-open" : "login"}
                            size={48}
                            color="white"
                        />
                        <Text variant="headlineMedium" style={styles.text}>
                            {isCheckedIn ? "MARCAR SALIDA" : "MARCAR ENTRADA"}
                        </Text>
                        {isCheckedIn && activeCheckIn && (
                            <Text variant="bodyMedium" style={styles.subtext}>
                                Entrada: {new Date(activeCheckIn.entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        )}
                    </>
                )}
            </Surface>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginVertical: 10,
    },
    active: {
        backgroundColor: COLORS.error, // Red for stop/exit
    },
    inactive: {
        backgroundColor: COLORS.success, // Green for start/enter
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtext: {
        color: 'white',
        opacity: 0.9,
        marginTop: 5,
    }
});
