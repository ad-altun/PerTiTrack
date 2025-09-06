import {
    type BaseQueryFn,
    createApi,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index.ts";

// base query with auth headers
const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: ( headers, { getState } ) => {
        // get token from Redux state
        const token = ( getState() as RootState ).auth.token;

        if ( token ) {
            headers.set('authorization', `Bearer ${ token }`);
        }

        headers.set('content-type', 'appplication/json');
        return headers;
    }
});

// base query with token refresh (re-authentication)
// (token refresh / Reauth will be implemented later,
// function name still kept with Reauth )
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs, unknown, FetchBaseQueryError> =
    async ( args, api, extraOptions ) => {
        const result = await baseQuery(args, api, extraOptions);

        if ( result.error && result.error.status === 401 ) {
            // token expired, logout user
            api.dispatch({ type: 'auth/logout' });
            localStorage.clear();
            // redirect to login
            if ( typeof window !== 'undefined' ) {
                window.location.href = '/login';
            }
        }

        return result;
    };

// create the main API slice
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [ 'User', 'Auth' ],
    endpoints: () => ( {} ),
});
