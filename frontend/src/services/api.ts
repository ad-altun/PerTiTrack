import axios, { AxiosError } from 'axios';
import { z } from 'zod';

const API_BASE_URL = '/api';

// API Error schema for error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiErrorSchema = z.object({
    message: z.string(),
    status: z.number().optional(),
    errors: z.array(z.string()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

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
    ( error: AxiosError ) => {
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

        return Promise.reject(error);
    }
);

export default api;
