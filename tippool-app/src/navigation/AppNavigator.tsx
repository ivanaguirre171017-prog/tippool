import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import AuthStack from './AuthStack';
import EncargadoTabs from './EncargadoTabs';
import MozoTabs from './MozoTabs';
import { COLORS } from '../constants/colors';

export default function AppNavigator() {
    const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <AuthStack />
            ) : user?.rol === 'ENCARGADO' ? (
                <EncargadoTabs />
            ) : (
                <MozoTabs />
            )}
        </NavigationContainer>
    );
}
