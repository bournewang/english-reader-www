import { apiRequest } from './helper';

export const addLookingWord = async (word: string, articleId: number, paragraphId: number) => {
    return apiRequest('/looking_word/add', 'POST', { word, article_id: articleId, paragraph_id: paragraphId });
};

export const getLookingWords = async () => {
    return apiRequest('/looking_word/get', 'GET');
};

export const getLookingWordsByArticle = async (articleId: number) => {
    return apiRequest('/looking_word/get/by_article/'+articleId, 'GET');
};
