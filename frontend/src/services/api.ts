import axios, { AxiosError } from 'axios';
import { apiErrorSchema, type ApiError } from '../schemas/authSchemas';

const API_BASE_URL = '/api';

// create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// add request interceptor to include auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if ( token ) {
            config.headers.Authorization = `Bearer ${ token }`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// add response interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    async ( error: AxiosError ) => {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            status: error.response?.status,
        };

        if ( error.response?.status === 401 ) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = 'href';
            apiError.message = 'Authentication failed. Please log in again.';
        } else if ( error.message === 'Network Error' ) {
            apiError.message = 'Network error. Please check your connection.';
        }

        // validate error with Zod before returning
        const validatedError = apiErrorSchema.parse(apiError);
        return Promise.reject(validatedError);
    }
);

export default api;
