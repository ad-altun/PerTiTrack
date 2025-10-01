import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JwtResponse, User } from '../../validation/authSchemas.ts';
import { STORAGE_KEYS } from '../../constants/storage';

interface AuthState {
    token: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        // additional user info for dynamic display
        fullName: string;
        profileName: string;
        employeeId?: string;
        employeeNumber?: string;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    // session management
    loginTime: string | null;
    lastActivity: string | null;
    sessionTimeout: number; // in minutes
    initialized: boolean; // to track if auth has been initialized
}

// Helper function to create computed user fields
const createUserWithComputedFields = ( userData: User ) => ( {
    ...userData,
    fullName: `${ userData.firstName || '' } ${ userData.lastName || '' }`.trim(),
    profileName: userData.lastName ? `${ userData.firstName } ${ userData.lastName }` : userData.firstName || '',
} );

// Initialize from localStorage
const getInitialState = (): AuthState => {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if ( token && userStr ) {
            const user = userStr ? JSON.parse(userStr) : null;

            // if the user exists, add additional info to
            // the user object with computed fields
            const updatedUser = user ? createUserWithComputedFields(user) : null;

            return {
                token,
                user: updatedUser,
                isAuthenticated: true,
                isLoading: false,
                loginTime: localStorage.getItem('loginTime'),
                lastActivity: localStorage.getItem('lastActivity') || new Date().toISOString(),
                sessionTimeout: 15, // 15 minutes, later if no interaction, logout user
                initialized: true,
            };
        }
    }
    catch (error) {
        console.error('Error initializing auth state:', error);
        // If localStorage is corrupted, clear it
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
    }
    return {
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        loginTime: null,
        lastActivity: null,
        sessionTimeout: 15,
        initialized: true,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        // Set credentials from successful login
        setCredentials: ( state, action: PayloadAction<JwtResponse> ) => {
            const {
                token,
                id,
                email,
                firstName,
                lastName,
                roles,
                employeeId,
                employeeNumber,
            } = action.payload;

            const loginTime = new Date().toISOString();

            // helper object
            const userData = {
                id,
                email,
                firstName: firstName || '',
                lastName: lastName || '',
                roles: roles || [],
                employeeId,
                employeeNumber,
            };

            state.token = token;
            state.user = createUserWithComputedFields(userData);
            state.isAuthenticated = true;
            state.isLoading = false;
            state.loginTime = loginTime;
            state.lastActivity = loginTime;
            state.initialized = true;

            try {
                // Persist to localStorage
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
                localStorage.setItem('loginTime', loginTime);
                localStorage.setItem('lastActivity', loginTime);
            }
            catch (error) {
                console.error('Error saving credentials to localStorage:', error);
            }
        },

        // Clear credentials on logout
        clearCredentials: ( state ) => {
            // reset state first
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.loginTime = null;
            state.lastActivity = null;

            try {
                // Clear localStorage
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem('loginTime');
                localStorage.removeItem('lastActivity');
            }
            catch (error) {
                console.error('Error clearing credentials from localStorage:', error);
            }
        },

        // Set loading state
        setLoading: ( state, action: PayloadAction<boolean> ) => {
            state.isLoading = action.payload;
        },
    },

    // Handle RTK Query actions
    extraReducers: ( builder ) => {
        // Later RTK Query actions, e.g., auto-logout on 401 responses
        // i.e., API authentication errors
    },
});

export const {
    setCredentials,
    clearCredentials,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = ( state: { auth: AuthState } ) => state.auth.user;

// Greeting selector for dynamic welcome messages
export const selectUserGreeting = ( state: { auth: AuthState } ) => {
    const user = state.auth.user;
    if ( !user ) return 'Welcome!';

    const name = user.lastName ? ` ${ user.firstName }` : 'Guest';
    const currentHour = new Date().getHours();

    if ( currentHour < 10 ) return `Good morning, ${ name }!`;
    if ( currentHour < 17 ) return `Good afternoon, ${ name }!`;
    return `Good evening, ${ name }!`;
};

// User roles and permissions
export const selectUserRoles = ( state: { auth: AuthState } ) =>
    state.auth.user?.roles || [];

export default authSlice.reducer;