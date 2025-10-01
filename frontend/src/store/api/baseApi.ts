import { type BaseQueryFn, createApi, type FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.ts";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearCredentials } from "../slices/authSlice.ts";

const baseQuery = fetchBaseQuery({
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
});

// base query with automatic token refresh and logout
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs, unknown, FetchBaseQueryError> =
    async ( args, api, extraOptions ) => {
        const result = await baseQuery(args, api, extraOptions);

        if ( result?.error?.status === 401 ) {
            console.log('Token expired or invalid, logging out...');

            // clear credentials from store
            api.dispatch(clearCredentials());

            //only redirect if not already on  auth pages
            const currentPath = window.location.pathname;
            if ( !currentPath.startsWith('/auth') &&
                !currentPath.includes('/unauthorized') ) {

                // store intended destination for after login
                sessionStorage.setItem('redirectAfterLogin', currentPath);

                // redirect to unauthorized page
                window.location.replace('/unauthorized');
            }
        }

        if ( result?.error?.status === 403 ) {
            console.log("Access forbidden");

            // redirect to forbidden page if not already there
            if ( window.location.pathname !== '/forbidden' ) {
                window.location.replace('/forbidden');
            }
        }

        return result;
    };

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: [
        'User',
        'Auth',
        'Employee',
        'TimeRecord',
        'WorkSchedule',
        'Absence',
        'AbsenceType',
        'Dashboard',
        'EmployeeDashboard',
        'ManagerDashboard',
        'MyTimeRecord',
        'MyAbsence',
        'PendingApproval',
    ],
    endpoints: () => ( {} ), // extended with injectEndpoints
});
