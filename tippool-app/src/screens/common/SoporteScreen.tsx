import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { useNavigation } from '@react-navigation/native';

const FAQS = [
    { id: '1', pregunta: '¿Cómo hago check-in?', respuesta: 'Para hacer check-in, ve a la pantalla de inicio y presiona el botón "INGRESAR". Asegúrate de tener tu ubicación activada.' },
    { id: '2', pregunta: '¿Cuándo se calculan repartos?', respuesta: 'Los repartos los calcula el encargado al finalizar el turno o el día, una vez que todos los mozos han registrado sus propinas.' },
    { id: '3', pregunta: '¿Cómo registro propinas?', respuesta: 'En la sección de Propinas, presiona el botón "+" o "Registrar" y completa el monto y método de pago.' },
    { id: '4', pregunta: '¿Puedo cambiar mi contraseña?', respuesta: 'Sí, ve a Perfil > Privacidad y Seguridad > Cambiar Contraseña.' },
];

export default function SoporteScreen() {
    const navigation = useNavigation<any>();

    const abrirEmail = () => {
        Linking.openURL('mailto:soporte@tippool.com?subject=Soporte TipPool');
    };

    const abrirWhatsApp = () => {
        const mensaje = 'Hola, necesito ayuda con TipPool';
        Linking.openURL(`whatsapp://send?phone=5491112345678&text=${encodeURIComponent(mensaje)}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>CONTACTO RÁPIDO</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.contactCard} onPress={abrirEmail}>
                        <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '15' }]}>
                            <MaterialIcons name="email" size={28} color={COLORS.primary} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Email</Text>
                            <Text style={styles.contactText}>soporte@tippool.com</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.contactCard} onPress={abrirWhatsApp}>
                        <View style={[styles.iconBox, { backgroundColor: '#25D36615' }]}>
                            <MaterialIcons name="chat" size={28} color="#25D366" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>WhatsApp</Text>
                            <Text style={styles.contactText}>+54 9 11 1234-5678</Text>
                            <Text style={styles.contactSubtext}>Lun-Vie 9:00-18:00</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.border} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>PREGUNTAS FRECUENTES</Text>
                <View style={styles.section}>
                    {FAQS.map((faq) => (
                        <View key={faq.id}>
                            <TouchableOpacity
                                style={styles.faqItem}
                                onPress={() => Linking.openURL(`https://tippool.com/faq/${faq.id}`)}
                            >
                                <View style={styles.faqHeader}>
                                    <MaterialIcons name="help-outline" size={20} color={COLORS.primary} />
                                    <Text style={styles.faqQuestion}>{faq.pregunta}</Text>
                                </View>
                                <MaterialIcons name="open-in-new" size={18} color={COLORS.border} />
                            </TouchableOpacity>
                            <Divider />
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.reportButton}
                    onPress={() => navigation.navigate('ReportarProblema')}
                >
                    <MaterialIcons name="bug-report" size={24} color="#FFF" />
                    <Text style={styles.reportButtonText}>REPORTAR UN PROBLEMA</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
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
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    contactText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    contactSubtext: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    faqItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    faqQuestion: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: SPACING.sm,
        fontWeight: '500',
    },
    reportButton: {
        backgroundColor: COLORS.text,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        marginTop: SPACING.md,
    },
    reportButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 10,
    }
});
