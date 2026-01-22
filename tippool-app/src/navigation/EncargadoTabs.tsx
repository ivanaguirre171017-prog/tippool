import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Screens
import DashboardEncargadoScreen from '../screens/encargado/DashboardEncargadoScreen';
import PersonalListScreen from '../screens/encargado/PersonalListScreen';
import PersonalCreateScreen from '../screens/encargado/PersonalCreateScreen';
import PersonalEditScreen from '../screens/encargado/PersonalEditScreen';
import PropinasListScreen from '../screens/encargado/PropinasListScreen';
import PropinasScreen from '../screens/encargado/PropinasScreen';
import RepartosListScreen from '../screens/encargado/RepartosListScreen';
import RepartosScreen from '../screens/encargado/RepartosScreen';
import RepartoDetalleScreen from '../screens/encargado/RepartoDetalleScreen';
import EstadisticasScreen from '../screens/encargado/EstadisticasScreen';
import PerfilScreen from '../screens/shared/PerfilScreen';
import NotificacionesScreen from '../screens/common/NotificacionesScreen';
import PrivacidadScreen from '../screens/common/PrivacidadScreen';
import SoporteScreen from '../screens/common/SoporteScreen';
import ReportarProblemaScreen from '../screens/common/ReportarProblemaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stacks for each Tab
const PersonalStack = () => (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
        <Stack.Screen name="PersonalList" component={PersonalListScreen} options={{ title: 'Personal' }} />
        <Stack.Screen name="PersonalCreate" component={PersonalCreateScreen} options={{ title: 'Nuevo Empleado' }} />
        <Stack.Screen name="PersonalEdit" component={PersonalEditScreen} options={{ title: 'Editar Empleado' }} />
    </Stack.Navigator>
);

const PropinasStack = () => (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
        <Stack.Screen name="PropinasList" component={PropinasListScreen} options={{ title: 'Historial Propinas' }} />
        <Stack.Screen name="RegistrarPropina" component={PropinasScreen} options={{ title: 'Registrar Propina' }} />
    </Stack.Navigator>
);

const RepartosStack = () => (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
        <Stack.Screen name="RepartosList" component={RepartosListScreen} options={{ title: 'Historial Repartos' }} />
        <Stack.Screen name="EjecutarReparto" component={RepartosScreen} options={{ title: 'Calcular Reparto' }} />
        <Stack.Screen name="RepartoDetalle" component={RepartoDetalleScreen} options={{ title: 'Detalle del Reparto' }} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
        <Stack.Screen name="PerfilMain" component={PerfilScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} options={{ title: 'Notificaciones' }} />
        <Stack.Screen name="Privacidad" component={PrivacidadScreen} options={{ title: 'Privacidad y Seguridad' }} />
        <Stack.Screen name="Soporte" component={SoporteScreen} options={{ title: 'Soporte Técnico' }} />
        <Stack.Screen name="ReportarProblema" component={ReportarProblemaScreen} options={{ title: 'Reportar Bug' }} />
    </Stack.Navigator>
);

export default function EncargadoTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.disabled,
                tabBarStyle: { height: 60, paddingBottom: 10 },
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === 'Inicio') iconName = 'home';
                    else if (route.name === 'Estadisticas') iconName = 'bar-chart';
                    else if (route.name === 'Personal') iconName = 'people';
                    else if (route.name === 'Propinas') iconName = 'attach-money';
                    else if (route.name === 'Repartos') iconName = 'calculate';
                    else if (route.name === 'Perfil') iconName = 'person';
                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={DashboardEncargadoScreen} options={{ tabBarLabel: 'Inicio' }} />
            <Tab.Screen name="Estadisticas" component={EstadisticasScreen} options={{ tabBarLabel: 'Estadísticas' }} />
            <Tab.Screen name="Personal" component={PersonalStack} options={{ tabBarLabel: 'Personal' }} />
            <Tab.Screen name="Propinas" component={PropinasStack} options={{ tabBarLabel: 'Propinas' }} />
            <Tab.Screen name="Repartos" component={RepartosStack} options={{ tabBarLabel: 'Repartos' }} />
            <Tab.Screen name="Perfil" component={ProfileStack} options={{ tabBarLabel: 'Perfil' }} />
        </Tab.Navigator>
    );
}
