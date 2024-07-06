import axios from 'axios';

const BASE_API_URL = process.env.PLASMO_PUBLIC_BASE_API_URL;
import { apiRequest } from './helper';

export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/auth/register`, { email, password });
        console.log("response: ")
        console.log(response)
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const userInfo = async () => {
    return apiRequest("/auth/info");
};

export const logoutUser = async () => {
    return apiRequest("/auth/logout", "POST");
};

export const updateLocale = async (locale) => {
    return apiRequest("/user/locale", "POST", {locale});
};