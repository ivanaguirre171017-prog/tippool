import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE } from '../../constants/design';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    right?: React.ReactNode;
    style?: ViewStyle;
}

export default function Input({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    right,
    style
}: InputProps) {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                error={!!error}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                style={styles.input}
                right={right}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        width: '100%',
    },
    input: {
        backgroundColor: COLORS.card,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.small,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
});
