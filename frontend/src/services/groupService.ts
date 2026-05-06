import api from '../api/axios';

export const groupService = {
    // Traer los grupos donde estoy metido
    getMyGroups: async () => {
        const response = await api.get('/Groups');
        return response.data;
    },

    // Crear un grupo nuevo
    createGroup: async (groupName: string) => {
        const response = await api.post('/Groups', { name: groupName });
        return response.data;
    },

    // Unirse a un grupo existente
    joinGroup: async (groupCode: string) => {
        // Mandamos el código en el body, mapeado a "GroupCode" que espera tu DTO de C#
        const response = await api.post('/Groups/join', { groupCode: groupCode });
        return response.data;
    },

    // Ver el ranking de un grupo específico
    getGroupRanking: async (groupId: number) => {
        const response = await api.get(`/Groups/${groupId}/ranking`);
        return response.data;
    }
};