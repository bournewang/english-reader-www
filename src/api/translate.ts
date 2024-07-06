import { apiRequest } from './helper';

export const translateText = async (text: string, target_lang?: string) => {
    const response = await apiRequest(`/translate/text`, 'POST', {text, target_lang});
    if (response.success) {
        return response.data;
    }
};
