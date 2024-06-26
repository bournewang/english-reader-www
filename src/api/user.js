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

export const logoutUser = async () => {
    try {
        const response = await apiRequest("/auth/logout", "POST")
        if (response.success) {
            chrome.storage.local.remove(['token', 'email'], () => {
                console.log('Token and email removed');
            });
        }
        return response.data;
    } catch (error) {
        throw error.response;
    }
};