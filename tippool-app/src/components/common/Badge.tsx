import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

interface BadgeProps {
    label: string;
    type?: 'success' | 'warning' | 'error' | 'info' | 'primary';
    style?: ViewStyle;
}

export default function Badge({ label, type = 'info', style }: BadgeProps) {
    const getColors = () => {
        switch (type) {
            case 'success': return { bg: '#E8F5E9', text: COLORS.success };
            case 'warning': return { bg: '#FFF3E0', text: COLORS.warning };
            case 'error': return { bg: '#FFEBEE', text: COLORS.error };
            case 'primary': return { bg: '#E8EAF6', text: COLORS.primary };
            default: return { bg: '#F5F7FA', text: COLORS.textLight };
        }
    };

    const colors = getColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
            <Text style={[styles.text, { color: colors.text }]}>
                {label.toUpperCase()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});
