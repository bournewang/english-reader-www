import { apiRequest } from './helper';

// export const createPlan = async (data = {}) => {
//     return apiRequest('/paypal/plans/create', 'POST', data);
// };

// export const getPlan = async (planId: number) => {
//     const response = await apiRequest(`/paypal/plans/${planId}`, 'GET');
//     if (response.success) {
//         return response.data;
//     } else {
//         throw new Error(response.message);
//     }
// };

export const getPlans = async () => {
    return apiRequest('/paypal/plans', 'GET');
};

export const createSubscription = async (planId: string) => {
    return apiRequest('/paypal/create-subscription', 'POST', { plan_id: planId });
};

export const getSubscriptions = async () => {
    return apiRequest('/paypal/subscriptions', 'GET');
};

export const suspendSubscription = async (subscriptionId: string) => {
    return apiRequest(`/paypal/subscriptions/${subscriptionId}/suspend`, 'POST');
};

export const cancelSubscription = async (subscriptionId: string) => {
    return apiRequest(`/paypal/subscriptions/${subscriptionId}/cancel`, 'POST');
};

export const activateSubscription = async (subscriptionId: string) => {
    return apiRequest(`/paypal/subscriptions/${subscriptionId}/activate`, 'POST');
};
