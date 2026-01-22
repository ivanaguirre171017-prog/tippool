import axios from 'axios';
import { CONFIG } from '../constants/config';
import { storage } from '../utils/storage';

const api = axios.create({
    baseURL: CONFIG.API_URL,
    timeout: CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await storage.clear();
            // Logic to redirect/logout should be handled by state listener
        }
        return Promise.reject(error);
    }
);

export default api;
