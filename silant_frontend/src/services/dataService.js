import api from '../http/index.js';

export const dataService = {
    async getMachines() {
        const response = await api.get('/sb/machines/');
        return response.data;
    },

    async getServices() {
        const response = await api.get('/sb/services/');
        return response.data;
    },

    async getClaims() {
        const response = await api.get('/sb/claims/');
        return response.data;
    },

    async getReferences() {
        const response = await api.get('/sb/reference/');
        return response.data;
    },

    async getClients() {
        const response = await api.get('/auth/client/');
        return response.data;
    },

    async getServiceCompanies() {
        const response = await api.get('/auth/service_company/');
        return response.data;
    },
};
