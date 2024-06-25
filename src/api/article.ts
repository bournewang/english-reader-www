import { apiRequest } from './helper';

export const addArticle = async (title: string, paragraphs: string[]) => {
    return apiRequest('/articles/create', 'POST', { title, paragraphs });
};

export const getArticle = async (articleId: number) => {
    return apiRequest(`/articles/${articleId}`, 'GET');
};

export const getArticles = async () => {
    return apiRequest(`/articles/list`, 'GET');
};
