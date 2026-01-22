import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

interface ResumenCardProps {
    items: {
        icon: keyof typeof MaterialIcons.glyphMap;
        label: string;
        value: string | number;
        color?: string;
    }[];
}

export const ResumenCard: React.FC<ResumenCardProps> = ({ items }) => {
    return (
        <View style={styles.resumenContainer}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <View style={styles.resumenItem}>
                        <MaterialIcons name={item.icon} size={24} color={item.color || COLORS.primary} />
                        <Text style={styles.resumenLabel}>{item.label}</Text>
                        <Text style={styles.resumenValue}>{item.value}</Text>
                    </View>
                    {index < items.length - 1 && <View style={styles.resumenDivider} />}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    resumenContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resumenItem: {
        flex: 1,
        alignItems: 'center',
    },
    resumenLabel: {
        fontSize: FONT_SIZE.small,
        color: COLORS.textLight,
        marginTop: 4,
    },
    resumenValue: {
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
        fontWeight: 'bold',
        marginTop: 2,
    },
    resumenDivider: {
        width: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.sm,
    },
});
