import api from '../api/axios';

export const adminService = {
    finishMatch: async (matchId: number, homeScore: number, awayScore: number) => {
        const response = await api.post('/Admin/finish-match', {
            matchId,
            actualHomeScore: homeScore,
            actualAwayScore: awayScore
        });
        return response.data;
    },
    syncMatches: async () => {
        const response = await api.post('/Admin/sync');
        return response.data;
    }
};