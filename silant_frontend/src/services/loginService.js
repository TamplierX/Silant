import api from '../http/index.js';

export const loginService = {
    async login(username, password) {
        const response = await api.post('/auth/login/', { username, password });
        return response.data;
    },

    async info() {
        const response = await api.get('/auth/profile/');
        return response.data;
    },
};
