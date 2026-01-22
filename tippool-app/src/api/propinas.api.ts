import api from './axios.config';
import { Propina } from '../types';

export const propinasApi = {
    create: async (data: { monto: number; metodoPago: string }): Promise<Propina> => {
        const response = await api.post('/propinas', data);
        return response.data.data;
    },

    getAll: async (filters: any = {}): Promise<Propina[]> => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/propinas?${params}`);
        return response.data.data;
    },

    getPendientes: async (): Promise<Propina[]> => {
        const response = await api.get('/propinas/pendientes');
        return response.data.data;
    }
};
