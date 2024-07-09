import { apiRequest } from './helper';

export const addLookingWord = async (word: string, articleId: number, paragraphId: number) => {
    return apiRequest('/unfamiliar_word/add', 'POST', { word, article_id: articleId, paragraph_id: paragraphId });
};

export const removeLookingWord = async (word: string, articleId: number, paragraphId: number) => {
    return apiRequest('/unfamiliar_word/delete', 'DELETE', { word, article_id: articleId, paragraph_id: paragraphId });
};

export const getLookingWords = async () => {
    return apiRequest('/unfamiliar_word/get', 'GET');
};

export const getLookingWordsByArticle = async (articleId: number) => {
    return apiRequest('/unfamiliar_word/get/by_article/'+articleId, 'GET');
};

