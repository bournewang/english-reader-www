import axios from 'axios';

const BASE_API_URL = process.env.PLASMO_PUBLIC_BASE_API_URL;

export const createArticle = async (token, title, paragraphs) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/articles/create`, { title, paragraphs }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getArticle = async (token, articleId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/articles/${articleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
