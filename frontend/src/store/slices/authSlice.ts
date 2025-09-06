import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    clearAuthData,
    getCurrentUser,
    getToken,
    isAuthenticated,
    setAuthData,
    validateStoredTokens,
} from "../../services/authService.ts";
import { authApi } from "../api/authApi.ts";
import type { AuthState } from "../types.ts";
import type { JwtResponse, User } from '../../types/authType.ts';
import { userSchema } from "../../schemas/authSchemas.ts";

// load initial state with token validation
const getInitialState = (): AuthState => {
    try {
        const isValid = validateStoredTokens();
        if ( !isValid ) {
            // the loadıng and error need to be assıgned properly
            return {
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        }
        return {
            user: getCurrentUser(),
            token: getToken(),
            isAuthenticated: isAuthenticated(),
            isLoading: false,
            error: null
        };
    }
    catch ( error ) {
        console.error('Failed to initialize auth state:', error);
        return {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        };
    }
};

// const initialState = getInitialState();

// implementing Auth Slice with RTK Query
const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        loginStart: ( state ) => {
            state.isLoading = true;
            state.error = null;
        },

        // loginSuccess: (state,
        // action: PayloadAction<{ authData: JwtResponse }>) => {
        //     const { authData } = action.payload;
        //
        //     state.user = userSchema.parse({
        //         id: authData.id,
        //         email: authData.email,
        //         firstName: authData.firstName,
        //         lastName: authData.lastName,
        //         roles: authData.roles,
        //     });
        //     state.token = authData.token;
        //     state.isAuthenticated = true;
        //     state.isLoading = false;
        //     state.error = null;
        //     // state.rememberMe = rememberMe;
        //
        // },

        logout: ( state ) => {
            clearAuthData();
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        setCredentials: ( state, action: PayloadAction<JwtResponse> ) => {
            const { token, id, email, firstName, lastName, roles } = action.payload;

            state.token = token;
            state.user = { id, email, firstName, lastName, roles };
            state.isAuthenticated = true;

            // store in localStorage with validation
            setAuthData(action.payload);
        },
        clearCredentials: ( state ) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            clearAuthData();
        },
        refreshAuthState: ( state ) => {
            const isValid = refreshAuthState();
            if ( !isValid ) {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            } else {
                state.user = getCurrentUser();
                state.token = getToken();
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            }
        },

        updateUser: ( state, action: PayloadAction<Partial<User>> ) => {
            if ( state.user ) {
                const updated = { ...state.user, ...action.payload };
                state.user = userSchema.parse(updated);

                // update localstorage
                localStorage.setItem('key', JSON.stringify(state.user));
            }
        },
    },
    extraReducers: ( builder ) => {
        // listen to login success from rtk query
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            ( state, action ) => {
                const jwtResponse = action.payload;
                state.user = userSchema.parse({
                    id: jwtResponse.id,
                    email: jwtResponse.email,
                    firstName: jwtResponse.firstName,
                    lastName: jwtResponse.lastName,
                    roles: jwtResponse.roles,
                });
                state.token = jwtResponse.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                // store in localStorage
                setAuthData(jwtResponse);
            }
        );

        // listen to auth failures
        builder.addMatcher(
            authApi.endpoints.login.matchRejected,
            // ( state, action: PayloadAction<string> ) => {
            ( state ) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                // state.error = action.payload;
            }
        );

        // listen to refresh token success
        builder.addMatcher(
            authApi.endpoints.refreshToken.matchFulfilled,
            ( state, action ) => {
                const jwtResponse = action.payload;
                state.token = jwtResponse.token;
                state.user = {
                    id: jwtResponse.id,
                    email: jwtResponse.email,
                    firstName: jwtResponse.firstName,
                    lastName: jwtResponse.lastName,
                    roles: jwtResponse.roles,
                };
                // state.isAuthenticated = false;
                state.isAuthenticated = true;

                // store in localStorage
                setAuthData(jwtResponse);
            }
        );

        // listen to logout success
        builder.addMatcher(
            authApi.endpoints.logout.matchFulfilled,
            ( state ) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;

                clearAuthData();
            }
        );

    },
});

export const {
    loginStart,
    logout,
    setCredentials,
    clearCredentials,
    refreshAuthState,
    updateUser
} = authSlice.actions;

export const authReducer = authSlice.reducer;