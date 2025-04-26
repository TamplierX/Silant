import api from '../http/index.js';

export const searchService = {
    async getMachine(searchValue) {
        const response = await api.get(`/sb/machines/${searchValue}/`);
        return response.data;
    },

    async createMachine(params) {
        const response = await api.post('/sb/machines/', params);
        return response.data;
    },

    async putMachine(id, params) {
        const response = await api.put(`/sb/machines/${id}/`, params);
        return response.data;
    },

    async getService(value) {
        const response = await api.get(`/sb/services/${value}/`);
        return response.data;
    },

    async createService(params) {
        const response = await api.post('/sb/services/', params);
        return response.data;
    },

    async putService(id, params) {
        const response = await api.put(`/sb/services/${id}/`, params);
        return response.data;
    },

    async getClaim(value) {
        const response = await api.get(`/sb/claims/${value}/`);
        return response.data;
    },

    async createClaim(params) {
        const response = await api.post('/sb/claims/', params);
        return response.data;
    },

    async putClaim(id, params) {
        const response = await api.put(`/sb/claims/${id}/`, params);
        return response.data;
    },

    async getReference(searchValue) {
        const response = await api.get(`/sb/reference/${searchValue}/`);
        return response.data;
    },

    async createReference(params) {
        const response = await api.post('/sb/reference/', params);
        return response.data;
    },

    async putReference(id, params) {
        const response = await api.put(`/sb/reference/${id}/`, params);
        return response.data;
    },

    async getClient(searchValue) {
        const response = await api.get(`/auth/client/${searchValue}/`);
        return response.data;
    },

    async createClient(params) {
        const response = await api.post('/auth/client/', params);
        return response.data;
    },

    async putClient(id, params) {
        const response = await api.put(`/auth/client/${id}/`, params);
        return response.data;
    },

    async getServiceCompany(searchValue) {
        const response = await api.get(`/auth/service_company/${searchValue}/`);
        return response.data;
    },

    async createServiceCompany(params) {
        const response = await api.post('/auth/service_company/', params);
        return response.data;
    },

    async putServiceCompany(id, params) {
        const response = await api.put(`/auth/service_company/${id}/`, params);
        return response.data;
    },

    async getServicesForMachine(value) {
        const response = await api.get(`/sb/services/?machine=${value}`);
        return response.data;
    },

    async getClaimsForMachine(value) {
        const response = await api.get(`/sb/claims/?machine=${value}`);
        return response.data;
    },

    async getReferencesForMachine() {
        const response = await api.get('/sb/references/machines/');
        return response.data;
    },

    async getReferencesForService() {
        const response = await api.get('/sb/references/services/');
        return response.data;
    },

    async getReferencesForClaim() {
        const response = await api.get('/sb/references/claims/');
        return response.data;
    },

    async getUsers() {
        const response = await api.get('/auth/users/');
        return response.data;
    },
};
