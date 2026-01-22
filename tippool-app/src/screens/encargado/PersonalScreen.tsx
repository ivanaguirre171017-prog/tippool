import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, List, Avatar, FAB } from 'react-native-paper';
import { usersApi } from '../../api/users.api';
import { User } from '../../types';
import { COLORS } from '../../constants/colors';

export default function PersonalScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await usersApi.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <List.Item
            title={`${item.nombre} ${item.apellido}`}
            description={item.email}
            left={props => <Avatar.Text {...props} size={40} label={item.nombre[0]} style={{ backgroundColor: item.rol === 'ENCARGADO' ? COLORS.secondary : COLORS.primary }} />}
            right={props => <Text {...props} style={{ alignSelf: 'center', color: item.activo ? COLORS.success : COLORS.textLight }}>{item.rol}</Text>}
            style={{ backgroundColor: COLORS.card, marginBottom: 5, borderRadius: 8 }}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshing={loading}
                onRefresh={loadUsers}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Add user not implemented in demo')}
                color="white"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.background
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary
    },
});
