import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JwtResponse } from '../../validation/authSchemas.ts';
import { STORAGE_KEYS } from '../../constants/storage';

interface AuthState {
    token: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Initialize from localStorage
const getInitialState = (): AuthState => {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN
        );
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const user = userStr ? JSON.parse(userStr) : null;

        return {
            token,
            user,
            isAuthenticated: !!token && !!user,
            isLoading: false,
        };
    }
    catch (error) {
        // If localStorage is corrupted, clear it
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return {
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
        };
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        // Set credentials from successful login
        setCredentials: ( state, action: PayloadAction<JwtResponse> ) => {
            const { token, id, email, firstName, lastName, roles } = action.payload;

            state.token = token;
            state.user = { id, email, firstName, lastName, roles };
            state.isAuthenticated = true;
            state.isLoading = false;

            // Persist to localStorage
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id, email, firstName, lastName, roles }));
        },

        // Clear credentials on logout
        clearCredentials: ( state ) => {

            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            // Clear localStorage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

        },

        // Set loading state
        setLoading: ( state, action: PayloadAction<boolean> ) => {
            state.isLoading = action.payload;
        },

        // Update user profile (without new token)
        updateUser: ( state, action: PayloadAction<Partial<AuthState['user']>> ) => {
            if ( state.user ) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
            }
        },
    },

    // Handle RTK Query actions
    extraReducers: ( builder ) => {
        // Later RTK Query actions, e.g. auto-logout on 401 responses
    },
});

export const {
    setCredentials,
    clearCredentials,
    setLoading,
    updateUser
} = authSlice.actions;

export default authSlice.reducer;