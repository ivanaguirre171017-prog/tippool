import api from './axios.config';
import { Reparto } from '../types';

interface DistributionResult {
    propinasProcesadas: number;
    repartosGenerados: number;
}

export const repartosApi = {
    getMyRepartos: async (params?: { fechaDesde?: string, limit?: number }): Promise<Reparto[]> => {
        const response = await api.get('/repartos/mis-repartos', { params });
        return response.data.data;
    },

    getDetail: async (id: string): Promise<any> => {
        const response = await api.get(`/repartos/detalle/${id}`);
        return response.data.data;
    },

    getAllHistory: async (fecha?: string): Promise<Reparto[]> => {
        const response = await api.get('/repartos/historial', {
            params: fecha ? { fecha } : {}
        });
        return response.data.data;
    },

    calculate: async (fecha: string): Promise<DistributionResult> => {
        const response = await api.post('/repartos/calcular', { fecha });
        return response.data.data;
    }
};
