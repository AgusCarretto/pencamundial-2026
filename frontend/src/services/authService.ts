import api from '../api/axios.ts';

export const authService = {
    login: async (userName: string, password: string) => {
        // Pegamos al endpoint que hicimos ayer en .NET
        const response = await api.post('/Auth/login', { userName, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    register: async (userName: string, phoneNumber: string, password: string) => {

        const response = await api.post('/Auth/register', { userName, phoneNumber, password });
        return response.data;
    }
};