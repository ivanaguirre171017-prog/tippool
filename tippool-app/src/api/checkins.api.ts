import api from './axios.config';
import { CheckIn } from '../types';

export const checkinsApi = {
    entry: async (): Promise<CheckIn> => {
        const response = await api.post('/checkins/entrada');
        return response.data.data;
    },

    exit: async (): Promise<CheckIn> => {
        const response = await api.post('/checkins/salida');
        return response.data.data;
    },

    getMyHistory: async (fecha?: string): Promise<CheckIn[]> => {
        const response = await api.get('/checkins/mis-checkins', {
            params: fecha ? { fecha } : {}
        });
        return response.data.data;
    },

    // Helper to find today's active checkin
    getByDate: async (fecha: string): Promise<CheckIn[]> => {
        const response = await api.get(`/checkins/fecha/${fecha}`);
        return response.data.data;
    },

    getActiveCheckIn: async (): Promise<CheckIn | undefined> => {
        const history = await checkinsApi.getMyHistory();
        // Assuming history is ordered desc
        const last = history[0];
        if (last && !last.salida) {
            return last;
        }
        return undefined;
    }
};
