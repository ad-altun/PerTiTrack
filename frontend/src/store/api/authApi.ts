import { baseApi } from "./baseApi.ts";
import {
    type JwtResponse,
    jwtResponseSchema, type LoginFormData,
    type MessageResponse,
    messageResponseSchema, type RegisterFormData,
    userSchema, type User
} from "../../validation/authSchemas.ts";

// transform and validate API response
const transformJwtResponse = ( response: unknown ): JwtResponse => {
    try {
        return jwtResponseSchema.parse(response);
    }
    catch ( error ) {
        console.error('Invalid JWT response: ', error);
        throw new Error('Invalid response format from server');
    }
};

const transformMessageResponse = ( response: unknown ): MessageResponse => {
    try {
        return messageResponseSchema.parse(response);
    }
    catch ( error ) {
        console.error('Invalid message response: ', error);
        throw new Error('Invalid response format from server');
    }
};

const transformUserResponse = ( response: unknown ): User => {
    try {
        return userSchema.parse(response);
    }
    catch ( error ) {
        console.error("Invalid user response. ", error);
        throw new Error('Invalid user data from server');
    }
};

// Auth API Slice with endpoints
export const authApi = baseApi.injectEndpoints({
    endpoints: ( builder ) => ( {
        // authentication endpoints
        login: builder.mutation<JwtResponse, LoginFormData>({
            query: ( credentials ) => ( {
                url: 'auth/signin',
                method: 'POST',
                body: credentials,
            } ),
            transformResponse: transformJwtResponse,
            invalidatesTags: [ 'Auth', 'User' ]
        }),

        // register endpoint
        register: builder.mutation<MessageResponse, RegisterFormData>({
            query: ( userData ) => {
                // remove confirmPassword before sending to API
                const { confirmPassword, ...apiUserData } = userData;
                return {
                    url: 'auth/signup',
                    method: 'POST',
                    body: apiUserData,
                };
            },
            transformResponse: transformMessageResponse,
            invalidatesTags: [ 'Auth' ],
        }),

        // add refresh token endpoint
        refreshToken: builder.mutation<JwtResponse, void>({
            query: () => ( {
                url: '/auth/refresh',
                method: 'Post',
            } ),
            transformResponse: transformJwtResponse,
            invalidatesTags: [ 'Auth', 'User' ]
        }),

        // forgot password request endpoint
        // (backend api is missing, will be added later)
        // forgotPassword: builder.mutation<MessageResponse, { email: string }>({
        //     query: ( emailData ) => ( {
        //         url: 'forgot-password',
        //         method: 'POST',
        //         body: emailData,
        //     } ),
        // }),

        // reset password request endpoint
        // (backend api is missing, will be added later)
        // resetPassword: builder.mutation<MessageResponse, { token: string; newPassword: string }>({
        //     query: ( resetData ) => ( {
        //         url: 'reset-password',
        //         method: 'POST',
        //         body: resetData,
        //     } ),
        // }),

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

        // get current user profile
        getCurrentUser: builder.query<User, void>({
            query: () => '/auth/me',
            transformResponse: transformUserResponse,
            providesTags: [ 'User' ],
        }),
    } ),
});

// export hooks for use in react components
export const {
    useLoginMutation,
    useRegisterMutation,
    // useForgotPasswordMutation,
    // useResetPasswordMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApi;