import api from '../api/axios';
import type { Match, Prediction } from '../types';

export const matchService = {
    // 1. Traer todos los partidos
    getMatches: async (): Promise<Match[]> => {
        const response = await api.get('/Matches');
        return response.data;
    },

    // 2. Traer las predicciones del usuario logueado
    getMyPredictions: async (): Promise<Prediction[]> => {
        const response = await api.get('/Predictions/my-predictions');
        return response.data;
    },

    // 3. Guardar o actualizar una predicción
    submitPrediction: async (matchId: number, homeScore: number, awayScore: number): Promise<Prediction> => {
        const response = await api.post('/Predictions', {
            matchId,
            predictedHomeScore: homeScore,
            predictedAwayScore: awayScore
        });
        return response.data;
    }
};