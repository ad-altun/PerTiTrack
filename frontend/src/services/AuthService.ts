import { z } from 'zod';
import api, { type ApiError } from "./api.ts";
import type {
    JwtResponse,
    MessageResponse,
    User
} from '../types/authType.ts';

import type {
    LoginFormData,
    RegisterFormData,
} from '../schemas/authSchemas.ts';

import {
    jwtResponseSchema,
    messageResponseSchema,
    userSchema
} from "../schemas/authSchemas.ts";

export default function AuthService() {

    const login = async ( credentials: LoginFormData ): Promise<JwtResponse> => {
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

    const register = async ( userData: RegisterFormData ): Promise<MessageResponse> => {
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

    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    };

    const getCurrentUser = (): User | null => {
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

    const getToken = (): string | null => {
        return localStorage.getItem('accessToken');
    };

    const isAuthenticated = (): boolean => {
        const token: string | null = getToken();
        const user: User | null = getCurrentUser();
        return !!( token && user );
    };

    const setAuthData = ( jwtResponse: JwtResponse ): void => {
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
    const isTokenExpired = (): boolean => {
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

    // method to refresh authentication state
    const refreshAuthState = (): boolean => {
        if ( isTokenExpired() ) {
            logout();
            return false;
        }
        return isAuthenticated();
    };
};