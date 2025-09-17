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
            // const updatedUser = user ? {
            //     ...user,
            //     fullName: `${user.firstName} ${user.lastName}`,
            //     profileName: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
            // } : null;

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
            const fullName = `${ firstName } ${ lastName }`;
            const profileName = lastName ? `${ firstName } ${ lastName }` : firstName;

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

        setInitialized: ( state ) => {
            state.initialized = true;
        },

        // Update user profile (without new token)
        updateUser: ( state, action: PayloadAction<Partial<AuthState['user']>> ) => {
            if ( state.user ) {
                const updatedUser = { ...state.user, ...action.payload };

                state.user = createUserWithComputedFields(updatedUser);

                // recalculate computed fields
                // if ( updatedUser.firstName || updatedUser.lastName ) {
                //     updatedUser.fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
                //     updatedUser.profileName = updatedUser.lastName
                //         ? `${updatedUser.firstName} ${updatedUser.lastName}`
                //         : updatedUser.firstName;
                // }

                // state.user = updatedUser;

                try {
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
                }
                catch (error) {
                    console.error('Error updating user profile in localStorage:', error);
                }

            }
        },

        // update last activity timestamp
        // for session management
        updateLastActivity: ( state ) => {
            const now = new Date().toISOString();
            state.lastActivity = now;

            try {
                localStorage.setItem('lastActivity', now);
            }
            catch (error) {
                console.error('Error updating last activity in localStorage:', error);
            }
        },

        // set session timeout
        setSessionTimeout: ( state, action: PayloadAction<number> ) => {
            // add validation
            // 1 min to 8 hours max
            state.sessionTimeout = Math.max(1, Math.min(action.payload, 480));
        },

        // handle session expirasion
        expireSession: ( state ) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.loginTime = null;
            state.lastActivity = null;

            // clear localStorage
            try {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem('loginTime');
                localStorage.removeItem('lastActivity');
            }
            catch (error) {
                console.error('Error expiring session: ', error);
            }
        }
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
    setLoading,
    updateUser,
    updateLastActivity,
    setSessionTimeout,
    expireSession,
    setInitialized,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = ( state: { auth: AuthState } ) => state.auth.user;
export const selectToken = ( state: { auth: AuthState } ) => state.auth.token;
export const selectIsAuthenticated = ( state: { auth: AuthState } ) => state.auth.isAuthenticated;
export const selectIsLoading = ( state: { auth: AuthState } ) => state.auth.isLoading;

// Enhanced selectors for dynamic display
export const selectUserFullName = ( state: { auth: AuthState } ) =>
    state.auth.user?.fullName || 'Unknown User';

export const selectUserFirstName = ( state: { auth: AuthState } ) =>
    state.auth.user?.firstName || '';

// export const selectUserLastName = (state: { auth: AuthState }) =>
//     state.auth.user?.lastName || '';

// Greeting selector for dynamic welcome messages
export const selectUserGreeting = ( state: { auth: AuthState } ) => {
    const user = state.auth.user;
    if ( !user ) return 'Welcome!';

    const title = user.lastName ? ` ${ user.firstName }` : 'Guest';
    const currentHour = new Date().getHours();

    if ( currentHour < 10 ) return `Good morning, ${ title }!`;
    if ( currentHour < 17 ) return `Good afternoon, ${ title }!`;
    return `Good evening, ${ title }!`;
};

// Employee info selectors
export const selectEmployeeInfo = ( state: { auth: AuthState } ) => ( {
    employeeId: state.auth.user?.employeeId || '',
    employeeNumber: state.auth.user?.employeeNumber || '',
    fullName: state.auth.user?.fullName || '',
} );

// Session management selectors
export const selectSessionInfo = ( state: { auth: AuthState } ) => ( {
    loginTime: state.auth.loginTime,
    lastActivity: state.auth.lastActivity,
    sessionTimeout: state.auth.sessionTimeout,
} );

// Check if the session is expired (helper selector)
export const selectIsSessionExpired = ( state: { auth: AuthState } ) => {
    const { lastActivity, sessionTimeout, isAuthenticated } = state.auth;

    if ( !isAuthenticated || !lastActivity ) return false;

    try {
        const lastActivityTime = new Date(lastActivity).getTime();
        const currentTime = new Date().getTime();
        const timeoutMs = sessionTimeout * 60 * 1000; // Convert minutes to milliseconds

        return ( currentTime - lastActivityTime ) > timeoutMs;
    }
    catch (error) {
        console.error('Error checking session expiration: ', error);
        return true; // assume expired on error
    }
};

// User roles and permissions
export const selectUserRoles = ( state: { auth: AuthState } ) =>
    state.auth.user?.roles || [];

export const selectHasRole = ( role: string ) => ( state: { auth: AuthState } ) =>
    state.auth.user?.roles.includes(role) || false;

export const selectIsAdmin = ( state: { auth: AuthState } ) =>
    state.auth.user?.roles.includes('ROLE_ADMIN') || false;

export const selectIsManager = ( state: { auth: AuthState } ) =>
    state.auth.user?.roles.includes('ROLE_MANAGER') || false;

export const selectIsEmployee = ( state: { auth: AuthState } ) =>
    state.auth.user?.roles.includes('ROLE_EMPLOYEE') || false;

export default authSlice.reducer;