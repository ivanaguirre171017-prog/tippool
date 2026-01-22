import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    type?: 'primary' | 'secondary' | 'outline' | 'error' | 'success';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    loading,
    disabled,
    type = 'primary',
    style,
    textStyle
}: ButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return COLORS.disabled;
        switch (type) {
            case 'primary': return COLORS.primary;
            case 'secondary': return COLORS.secondary;
            case 'outline': return 'transparent';
            case 'error': return COLORS.error;
            case 'success': return COLORS.success;
            default: return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (type === 'outline') return COLORS.primary;
        return 'white';
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                type === 'outline' && { borderWidth: 1, borderColor: COLORS.primary },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={type === 'outline' ? COLORS.primary : 'white'} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        marginVertical: SPACING.sm,
    },
    text: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
    },
});
