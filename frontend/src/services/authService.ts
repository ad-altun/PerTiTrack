import { z } from 'zod';
import api from "./api.ts";
import type {
    JwtResponse,
    MessageResponse,
    User
} from '../types/authTypes.ts';

import type {
    LoginFormData,
    RegisterFormData,
} from '../validation/authSchemas.ts';

import {
    jwtResponseSchema,
    messageResponseSchema,
    userSchema
} from "../validation/authSchemas.ts";

// const authService = () => {

export const login = async ( credentials: LoginFormData ): Promise<JwtResponse> => {
    try {
        const response = await api.post('/auth/signin', credentials);

        // validate response with Zod
        return jwtResponseSchema.parse(response.data);
    }
    catch ( error ) {
        if ( error instanceof z.ZodError ) {
            throw new Error('Invalid response format from server.');
        }
        throw error;
    }
};

export const register = async ( userData: RegisterFormData ): Promise<MessageResponse> => {
    try {
        // remove confirmPassword before sending to API
        const { confirmPassword, ...apiData } = userData;
        const response = await api.post<JwtResponse>('/auth/signup', userData);

        // validate response with Zod
        return messageResponseSchema.parse(response.data);
    }
    catch ( error ) {
        if ( error instanceof z.ZodError ) {
            throw new Error('Invalid response format from server.');
        }
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
    try {
        const userStr = localStorage.getItem('user');
        if ( userStr ) {
            return userSchema.parse(JSON.parse(userStr));
        }
    }
    catch ( error ) {
        // clear invalid user data
        localStorage.removeItem('user');
        console.warn('Invalid user data in localStorage, cleared.');
    }
    return null;
};

export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const isAuthenticated = (): boolean => {
    const token: string | null = getToken();
    const user: User | null = getCurrentUser();
    return !!( token && user );
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const setAuthData = ( jwtResponse: JwtResponse ): void => {
    try {
        // validate jwt response before storing
        const validatedResponse = jwtResponseSchema.parse(jwtResponse);

        localStorage.setItem('accessToken', validatedResponse.token);

        const user: User = {
            id: validatedResponse.id,
            email: validatedResponse.email,
            firstName: validatedResponse.firstName,
            lastName: validatedResponse.lastName,
            roles: validatedResponse.roles,
        };

        // validate user data before storing
        const validatedUser = userSchema.parse(user);
        localStorage.setItem('user', JSON.stringify(validatedUser));
    }
    catch ( error ) {
        console.error('Failed to store auth data:', error);
        throw new Error('Invalid authentication data received');
    }
};

// check for token expiration
export const isTokenExpired = (): boolean => {
    const token = getToken();
    if ( !token ) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[ 1 ]));
        return Date.now() >= ( payload.exp * 1000 );
    }
    catch {
        return true;
    }
};

export const clearAuthData = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// method to refresh authentication state
export const refreshAuthState = (): boolean => {
    if ( isTokenExpired() ) {
        const refreshToken = getRefreshToken();
        if ( !refreshToken ) {
            clearAuthData();
            return false;
        }
        return true;
    }
    return isAuthenticated();
};

// utility methods for token validation
export const validateStoredTokens = (): boolean => {
    try {
        const token = getToken();
        const refreshToken = getRefreshToken();
        const user = getCurrentUser();

        if ( !token || !refreshToken || !user ) {
            clearAuthData();
            return false;
        }

        return true;
    }
    catch ( error ) {
        console.log('Token validation failed: ', error);
        clearAuthData();
        return false;
    }
};
// };

// export default authService;