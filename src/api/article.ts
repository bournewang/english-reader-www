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

export interface Article {
    'id': number | null;
    'title': string | null;
    'word_count': number | null;
    'author': string | null,
    'url': string | null,
    'site': string | null,
    'site_name': string | null,
    'site_icon': string | null,
    'created_at': string | null
    'paragraphs': string[];
    'unfamiliar_words': string[];
}