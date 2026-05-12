import axios from 'axios';

const api = axios.create({

    baseURL: 'https://api-penca-agustin-dff6hdaqh9edfbd8.centralus-01.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar el Token JWT en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar sesiones expiradas (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Aquí podrías forzar una redirección al login si fuera necesario
        }
        return Promise.reject(error);
    }
);

export default api;