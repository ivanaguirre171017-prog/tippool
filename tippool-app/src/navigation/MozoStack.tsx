import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardMozoScreen from '../screens/mozo/DashboardMozoScreen';
import MisRepartosScreen from '../screens/mozo/MisRepartosScreen';
import PerfilScreen from '../screens/mozo/PerfilScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MozoStack() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: 'white',
                tabBarActiveTintColor: COLORS.primary,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardMozoScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Mis Repartos"
                component={MisRepartosScreen}
                options={{
                    tabBarLabel: 'Repartos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
