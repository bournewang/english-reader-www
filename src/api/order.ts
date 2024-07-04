import { apiRequest } from './helper';

export const createOrder = async (data = {}) => {
    return apiRequest('/order/create', 'POST', data);
};

