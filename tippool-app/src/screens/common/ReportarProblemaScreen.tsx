import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import Button from '../../components/common/Button';
import api from '../../api/axios.config';
import { useNavigation } from '@react-navigation/native';

export default function ReportarProblemaScreen() {
    const navigation = useNavigation();
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    const enviarReporte = async () => {
        if (!descripcion.trim()) {
            Alert.alert('Error', 'Por favor describe el problema');
            return;
        }

        try {
            setLoading(true);
            await api.post('/soporte/reportar', {
                tipo: 'bug',
                descripcion,
                dispositivo: Platform.OS,
                version: '1.0.0'
            });
            Alert.alert('✅ Enviado', 'Gracias por tu reporte. Lo revisaremos pronto.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar el reporte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialIcons name="bug-report" size={48} color={COLORS.primary} />
                    <Text style={styles.title}>Reportar un problema</Text>
                    <Text style={styles.subtitle}>Cuéntanos qué sucedió para que podamos ayudarte.</Text>
                </View>

                <Text style={styles.label}>Descripción del error:</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholder="Ej: La pantalla de repartos se queda cargando indefinidamente..."
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <Button
                    title="ENVIAR REPORTE"
                    onPress={enviarReporte}
                    loading={loading}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
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
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginBottom: SPACING.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    textArea: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
        minHeight: 150,
        marginBottom: SPACING.xl,
    },
    button: {
        height: 56,
        borderRadius: 12,
    }
});
