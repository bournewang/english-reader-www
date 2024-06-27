import { apiRequest } from './helper';

export const getStats = async () => {
    return apiRequest(`/stats/get`, 'GET');
};
