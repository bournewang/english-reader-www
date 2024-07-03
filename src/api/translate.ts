import { apiRequest } from './helper';

export const translateText = async (text: string) => {
    const response = await apiRequest(`/translate/text`, 'POST', {text});
    if (response.success) {
        return response.data;
    }
};
