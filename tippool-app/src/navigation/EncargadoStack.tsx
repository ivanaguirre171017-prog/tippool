import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardEncargadoScreen from '../screens/encargado/DashboardEncargadoScreen';
import PropinasScreen from '../screens/encargado/PropinasScreen';
import RepartosScreen from '../screens/encargado/RepartosScreen';
import PersonalScreen from '../screens/encargado/PersonalScreen';
import AsistenciaScreen from '../screens/encargado/AsistenciaScreen';

const Stack = createNativeStackNavigator();

export default function EncargadoStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DashboardEncargado" component={DashboardEncargadoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Propinas" component={PropinasScreen} options={{ title: 'Registrar Propina' }} />
            <Stack.Screen name="Repartos" component={RepartosScreen} options={{ title: 'Gestión de Repartos' }} />
            <Stack.Screen name="Personal" component={PersonalScreen} options={{ title: 'Personal' }} />
            <Stack.Screen name="Asistencia" component={AsistenciaScreen} options={{ title: 'Control de Asistencia' }} />
        </Stack.Navigator>
    );
}
