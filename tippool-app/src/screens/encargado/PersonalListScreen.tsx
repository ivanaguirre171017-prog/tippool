import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { usersApi } from '../../api/users.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/design';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { FilterButton } from '../../components/common/FilterButton';
import { EmptyState } from '../../components/common/EmptyState';
import { User } from '../../types';

export default function PersonalListScreen({ navigation }: any) {
    const [empleados, setEmpleados] = useState<User[]>([]);
    const [filtro, setFiltro] = useState<'todos' | 'activos' | 'inactivos'>('todos');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getAll();
            setEmpleados(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los empleados');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleToggleStatus = (empleado: User) => {
        const action = empleado.activo ? 'desactivar' : 'activar';
        Alert.alert(
            `¿${action.charAt(0).toUpperCase() + action.slice(1)} empleado?`,
            `¿Estás seguro que quieres ${action} a ${empleado.nombre} ${empleado.apellido}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: action.toUpperCase(),
                    style: empleado.activo ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            await usersApi.update(empleado.id, { activo: !empleado.activo });
                            loadData();
                            Alert.alert('✅ Listo', `Empleado ${empleado.activo ? 'desactivado' : 'activado'} correctamente`);
                        } catch (error) {
                            Alert.alert('Error', `No se pudo ${action} el empleado`);
                        }
                    }
                }
            ]
        );
    };

    const filteredEmpleados = empleados.filter(e => {
        if (filtro === 'activos') return e.activo;
        if (filtro === 'inactivos') return !e.activo;
        return true;
    });

    if (loading && !refreshing) return <LoadingScreen />;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.nuevoButton}
                onPress={() => navigation.navigate('PersonalCreate')}
            >
                <MaterialIcons name="add" size={24} color="#FFF" />
                <Text style={styles.nuevoButtonText}>Nuevo Empleado</Text>
            </TouchableOpacity>

            <View style={styles.filtrosContainer}>
                <FilterButton
                    label="Todos"
                    active={filtro === 'todos'}
                    count={empleados.length}
                    onPress={() => setFiltro('todos')}
                />
                <FilterButton
                    label="Activos"
                    active={filtro === 'activos'}
                    count={empleados.filter(e => e.activo).length}
                    onPress={() => setFiltro('activos')}
                />
                <FilterButton
                    label="Inactivos"
                    active={filtro === 'inactivos'}
                    count={empleados.filter(e => !e.activo).length}
                    onPress={() => setFiltro('inactivos')}
                />
            </View>

            <FlatList
                data={filteredEmpleados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EmpleadoCard
                        empleado={item}
                        onEditar={() => navigation.navigate('PersonalEdit', { user: item })}
                        onToggleStatus={() => handleToggleStatus(item)}
                    />
                )}
                ListEmptyComponent={<EmptyState message="No hay empleados" />}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const EmpleadoCard = ({ empleado, onEditar, onToggleStatus }: any) => {
    const getRolColor = (rol: string) => {
        return rol === 'ENCARGADO' ? COLORS.primary : COLORS.secondary;
    };

    return (
        <View style={styles.empleadoCard}>
            <View style={styles.empleadoHeader}>
                <Avatar.Text
                    size={50}
                    label={`${empleado.nombre[0]}${empleado.apellido[0]}`}
                    style={[styles.avatar, { backgroundColor: getRolColor(empleado.rol) }]}
                />
                <View style={styles.empleadoInfo}>
                    <Text style={styles.empleadoNombre}>
                        {empleado.nombre} {empleado.apellido}
                    </Text>
                    <View style={[styles.rolBadge, { backgroundColor: getRolColor(empleado.rol) }]}>
                        <Text style={styles.rolText}>{empleado.rol}</Text>
                    </View>
                    <Text style={styles.empleadoEmail}>{empleado.email}</Text>
                    <View style={styles.estadoBadge}>
                        <MaterialIcons
                            name={empleado.activo ? 'check-circle' : 'cancel'}
                            size={16}
                            color={empleado.activo ? COLORS.success : COLORS.error}
                        />
                        <Text style={[
                            styles.estadoText,
                            { color: empleado.activo ? COLORS.success : COLORS.error }
                        ]}>
                            {empleado.activo ? 'Activo' : 'Inactivo'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.empleadoActions}>
                <TouchableOpacity style={styles.actionButton} onPress={onEditar}>
                    <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                    <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onToggleStatus}
                >
                    <MaterialIcons
                        name={empleado.activo ? 'block' : 'check-circle'}
                        size={20}
                        color={empleado.activo ? COLORS.error : COLORS.success}
                    />
                    <Text style={[
                        styles.actionButtonText,
                        { color: empleado.activo ? COLORS.error : COLORS.success }
                    ]}>
                        {empleado.activo ? 'Desactivar' : 'Activar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    nuevoButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    nuevoButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.body,
        marginLeft: SPACING.sm,
    },
    filtrosContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
    },
    listContainer: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    empleadoCard: {
        backgroundColor: '#FFF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 2,
    },
    empleadoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: SPACING.md,
    },
    empleadoInfo: {
        flex: 1,
    },
    empleadoNombre: {
        fontSize: FONT_SIZE.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    rolBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginVertical: 4,
    },
    rolText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    empleadoEmail: {
        fontSize: FONT_SIZE.caption,
        color: COLORS.textLight,
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    estadoText: {
        fontSize: FONT_SIZE.small,
        fontWeight: '600',
        marginLeft: 4,
    },
    empleadoActions: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.caption,
    },
});
