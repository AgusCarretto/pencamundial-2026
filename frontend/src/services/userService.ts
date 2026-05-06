import api from '../api/axios';
import type { UserRanking } from '../types';

export const userService = {
    getGlobalRanking: async (): Promise<UserRanking[]> => {
        // Pegamos al endpoint de .NET que hicimos
        const response = await api.get('/Users/global-ranking');
        return response.data;
    }
};