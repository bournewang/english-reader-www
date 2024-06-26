import { apiRequest } from './helper';

export const addArticle = async (data = {}) => {
    return apiRequest('/articles/create', 'POST', data);
};

export const getArticle = async (articleId: number) => {
    const response = await apiRequest(`/articles/${articleId}`, 'GET');
    if (response.success) {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};

export const getArticles = async () => {
    return apiRequest(`/articles/list`, 'GET');
};
