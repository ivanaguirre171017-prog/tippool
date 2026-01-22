import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Screens
import DashboardMozoScreen from '../screens/mozo/DashboardMozoScreen';
import MisRepartosScreen from '../screens/mozo/MisRepartosScreen';
import PerfilScreen from '../screens/shared/PerfilScreen';
import NotificacionesScreen from '../screens/common/NotificacionesScreen';
import PrivacidadScreen from '../screens/common/PrivacidadScreen';
import SoporteScreen from '../screens/common/SoporteScreen';
import ReportarProblemaScreen from '../screens/common/ReportarProblemaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
        <Stack.Screen name="PerfilMain" component={PerfilScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} options={{ title: 'Notificaciones' }} />
        <Stack.Screen name="Privacidad" component={PrivacidadScreen} options={{ title: 'Privacidad y Seguridad' }} />
        <Stack.Screen name="Soporte" component={SoporteScreen} options={{ title: 'Soporte Técnico' }} />
        <Stack.Screen name="ReportarProblema" component={ReportarProblemaScreen} options={{ title: 'Reportar Bug' }} />
    </Stack.Navigator>
);

export default function MozoTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerTintColor: COLORS.primary,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.disabled,
                tabBarStyle: { height: 60, paddingBottom: 10 },
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === 'Inicio') iconName = 'home';
                    else if (route.name === 'Mis Repartos') iconName = 'monetization-on';
                    else if (route.name === 'Perfil') iconName = 'person';
                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={DashboardMozoScreen} options={{ tabBarLabel: 'Inicio' }} />
            <Tab.Screen name="Mis Repartos" component={MisRepartosScreen} options={{ tabBarLabel: 'Propinas' }} />
            <Tab.Screen name="Perfil" component={ProfileStack} options={{ tabBarLabel: 'Perfil', headerShown: false }} />
        </Tab.Navigator>
    );
}
