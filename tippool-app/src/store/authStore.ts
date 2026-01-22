import { create } from 'zustand';
import { storage } from '../utils/storage';
import { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (user, token) => {
        await storage.setToken(token);
        await storage.setUser(user);
        set({ user, token, isAuthenticated: true });
    },

    logout: async () => {
        await storage.clear();
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = await storage.getToken();
            const user = await storage.getUser();
            if (token && user) {
                set({ token, user, isAuthenticated: true });
            } else {
                set({ token: null, user: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ token: null, user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },

    setUser: (user: User) => {
        storage.setUser(user);
        set({ user });
    }
}));
