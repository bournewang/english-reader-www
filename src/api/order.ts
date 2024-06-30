import { apiRequest } from './helper';

export const createOrder = async (data = {}) => {
    return apiRequest('/order/create', 'POST', data);
};

export const captureOrder = async (orderId: string) => {
    return apiRequest('/order/capture/${orderId}', 'POST');
};

