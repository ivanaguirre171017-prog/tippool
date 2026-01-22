import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE } from '../../constants/design';

interface EmptyStateProps {
    icon?: keyof typeof MaterialIcons.glyphMap;
    message: string;
    subtext?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'info-outline',
    message,
    subtext
}) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name={icon} size={64} color={COLORS.textLight} />
            <Text style={styles.message}>{message}</Text>
            {subtext && <Text style={styles.subtext}>{subtext}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        marginTop: SPACING.xl,
    },
    message: {
        fontSize: FONT_SIZE.subtitle,
        color: COLORS.text,
        fontWeight: 'bold',
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    subtext: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textLight,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
});
