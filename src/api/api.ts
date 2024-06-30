import axios from 'axios';
// import { BASE_API_URL } from '../config';
import { useUser } from '~contexts/UserContext';

const BASE_API_URL = process.env.PLASMO_PUBLIC_BASE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
});

const attachTokenInterceptor = (accessToken: string | null) => {
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export { api, attachTokenInterceptor };
