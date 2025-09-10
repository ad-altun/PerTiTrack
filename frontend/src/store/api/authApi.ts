import type {
    ForgotPasswordFormData,
    JwtResponse,
    LoginFormData,
    MessageResponse,
    RegisterFormData,
    ResetPasswordFormData,
    User
} from "../../validation/authSchemas.ts";
import { jwtResponseSchema, messageResponseSchema, userSchema } from "../../validation/authSchemas.ts";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.ts";
import { STORAGE_KEYS } from "../../constants/storage";


// transform and validate API response
const transformJwtResponse = ( response: unknown ): JwtResponse => {
    try {
        return jwtResponseSchema.parse(response);
    }
    catch (error) {
        console.error('Invalid JWT response: ', error);
        throw new Error('Invalid response format from server');
    }
};

const transformMessageResponse = ( response: unknown ): MessageResponse => {
    try {
        return messageResponseSchema.parse(response);
    }
    catch (error) {
        console.error('Invalid message response: ', error);
        throw new Error('Invalid response format from server');
    }
};

const transformUserResponse = ( response: unknown ): User => {
    try {
        return userSchema.parse(response);
    }
    catch (error) {
        console.error("Invalid user response. ", error);
        throw new Error('Invalid user data from server');
    }
};

// Auth API Slice with endpoints
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: ( headers, { getState } ) => {

            // Get token from Redux state
            const token = ( getState() as RootState ).auth?.token;

            if ( token ) {
                headers.set('authorization', `Bearer ${ token }`);
            }

            headers.set('content-type', 'application/json');
            return headers;
        },
    }),
    tagTypes: [ 'User', 'Auth' ],
    endpoints: ( builder ) => ( {
        // authentication endpoints
        login: builder.mutation<JwtResponse, LoginFormData>({
            query: ( credentials ) => ( {
                url: '/auth/signin',
                method: 'POST',
                body: credentials,
            } ),
            transformResponse: transformJwtResponse,
            invalidatesTags: [ 'Auth', 'User' ]
        }),

        // register endpoint
        // register: builder.mutation<JwtResponse, RegisterRequest>({
        register: builder.mutation<MessageResponse, RegisterFormData>({
            query: ( userData ) => {
                // remove confirmPassword before sending to API
                const { confirmPassword, ...apiUserData } = userData;
                return {
                    url: '/auth/signup',
                    method: 'POST',
                    body: apiUserData,
                };
            },
            transformResponse: transformMessageResponse,
            invalidatesTags: [ 'Auth' ],
        }),

        // get current user profile
        // getMe: builder.query<JwtResponse, void>({
        // getMe: builder.query<User, void>({
        //     query: () => '/me',
        //     transformResponse: transformUserResponse,
        //     providesTags: [ 'User' ],
        // }),


        // forgot password request endpoint
        // (backend api is still missing)
        forgotPassword: builder.mutation<MessageResponse, ForgotPasswordFormData>({
            query: ( emailData ) => ( {
                url: '/auth/forgot-password',
                method: 'POST',
                body: emailData,
            } ),
        }),

        // reset password request endpoint
        // (backend api is still missing)
        resetPassword: builder.mutation<MessageResponse, ResetPasswordFormData>({
            query: ( resetData ) => ( {
                url: '/auth/reset-password',
                method: 'POST',
                body: resetData,
            } ),
        }),

        // logout request endpoint
        // (backend api is missing, will be added later)
        logout: builder.mutation<MessageResponse, void>({
            query: () => ( {
                url: '/auth/logout',
                method: 'POST',
            } ),
            transformResponse: transformMessageResponse,
            invalidatesTags: [ 'Auth', 'User' ],
        }),


        // Check if user is authenticated
        checkAuth: builder.query<{ isAuthenticated: boolean; token: string | null }, void>({
            queryFn: () => {
                try {
                    const authData = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(
                        STORAGE_KEYS.ACCESS_TOKEN);
                    if ( authData ) {
                        const parsed = JSON.parse(authData);

                        // Check token expiration
                        if ( parsed.token ) {
                            try {
                                const payload = JSON.parse(atob(parsed.token.split('.')[ 1 ]));
                                const currentTime = Date.now() / 1000;

                                if ( payload.exp > currentTime ) {
                                    return {
                                        data: {
                                            isAuthenticated: true,
                                            token: parsed.token
                                        }
                                    };
                                } else {
                                    // Token expired, clear storage
                                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                                    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                                }
                            }
                            catch (error) {
                                console.error('Error checking token expiration:', error);
                            }
                        }
                    }

                    return { data: { isAuthenticated: false, token: null } };
                }
                catch (error) {
                    return { error: { status: 500, data: 'Error checking auth status' } };
                }
            },
            providesTags: [ 'Auth' ],
        }),

        // add refresh token endpoint
        // refreshToken: builder.mutation<JwtResponse, void>({
        //     query: () => ( {
        //         url: '/refresh',
        //         method: 'Post',
        //     } ),
        //     transformResponse: transformJwtResponse,
        //     invalidatesTags: [ 'Auth', 'User' ]
        // }),

    } ),
});

// export hooks for use in react components
export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    // useRefreshTokenMutation,
    useLogoutMutation,
    // useGetMeQuery,
} = authApi;