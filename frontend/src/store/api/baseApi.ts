import {
    // type BaseQueryFn,
    createApi,
    // type FetchArgs,
    fetchBaseQuery,
    // type FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
// import type { RootState } from '../storeTypes.ts';

// base query with auth headers
const baseQuery = fetchBaseQuery({
    baseUrl: '/api/auth',
    prepareHeaders: ( headers ) => {
        // Get token from localStorage
        const authData = localStorage.getItem('auth');

        let token = null;
        if ( authData ) {
            try {
                const parsed = JSON.parse(authData);
                token = parsed.token;
            }
            catch ( error ) {
                console.error('Error parsing auth data:', error);
            }
        }

        // Check sessionStorage if not in localStorage
        if ( !token ) {
            const sessionAuth = sessionStorage.getItem('auth');
            if ( sessionAuth ) {
                try {
                    const parsed = JSON.parse(sessionAuth);
                    token = parsed.token;
                }
                catch ( error ) {
                    console.error('Error parsing session auth data:', error);
                }
            }
        }

        if ( token ) {
            headers.set('authorization', `Bearer ${ token }`);
        }

        headers.set('content-type', 'application/json');
        return headers;
    }
});

// base query with token refresh (re-authentication)
// (token refresh / Reauth will be implemented later,
// function name still kept with Reauth )
// const baseQueryWithReauth: BaseQueryFn<
//     string | FetchArgs, unknown, FetchBaseQueryError> =
//     async ( args, api, extraOptions ) => {
//         const result = await baseQuery(args, api, extraOptions);
//
//         if ( result.error && result.error.status === 401 ) {
//             // token expired, logout user
//             api.dispatch({ type: 'auth/logout' });
//             localStorage.clear();
//             // redirect to login
//             if ( typeof window !== 'undefined' ) {
//                 window.location.href = '/signin';
//             }
//         }
//
//         return result;
//     };

// create the main API slice
export const baseApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQuery,
    tagTypes: [ 'User', 'Auth' ],
    endpoints: () => ( {} ),
});
