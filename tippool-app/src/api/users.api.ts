import api from './axios.config';
import { User } from '../types';

export const usersApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data.data;
    },

    getOne: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    },

    update: async (id: string, data: Partial<User>): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
};
