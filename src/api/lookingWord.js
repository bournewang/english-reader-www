import axios from 'axios';

const BASE_API_URL = process.env.PLASMO_PUBLIC_BASE_API_URL;

export const addLookingWord = async (token, word, articleId, paragraphId) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/looking_word/add`, { word, articleId, paragraphId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getLookingWords = async (token) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/looking_word/get`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
