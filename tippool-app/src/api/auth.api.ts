import api from './axios.config';
import { AuthResponse } from '../types';

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data.data;
    },

    me: async (): Promise<any> => {
        const response = await api.get('/auth/me');
        return response.data.data;
    },

    register: async (userData: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', userData);
        return response.data.data;
    }
};
