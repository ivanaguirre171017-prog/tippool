import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';

interface FilterButtonProps {
    label: string;
    active: boolean;
    onPress: () => void;
    count?: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onPress, count }) => {
    return (
        <TouchableOpacity
            style={[styles.container, active && styles.activeContainer]}
            onPress={onPress}
        >
            <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
            {count !== undefined && (
                <View style={[styles.badge, active && styles.activeBadge]}>
                    <Text style={[styles.badgeText, active && styles.activeBadgeText]}>{count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    activeContainer: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    label: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    activeLabel: {
        color: '#FFF',
    },
    badge: {
        marginLeft: SPACING.xs,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    badgeText: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: 'bold',
    },
    activeBadgeText: {
        color: '#FFF',
    },
});
