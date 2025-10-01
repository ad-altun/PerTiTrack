import { isRejectedWithValue } from "@reduxjs/toolkit";
import type {Middleware, MiddlewareAPI, SerializedError} from "@reduxjs/toolkit";
import { clearCredentials } from "../slices/authSlice.ts";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";


export const rtkQueryErrorLogger: Middleware =
    ( api: MiddlewareAPI ) => ( next ) => ( action ) => {
        // RTK Query uses -rejected- action type
        // with a 'payload' of 'FetchBaseQueryError'
        if ( isRejectedWithValue(action) ) {
            const payload = action.payload as FetchBaseQueryError;

            // handle different error status codes
            if ( payload.status === 401 ) {
                // Unauthorized - clear credentials and redirect to login
                console.warn('401 Unauthorized - Clearing credentials and redirecting to login')
                api.dispatch(clearCredentials());

                // redirect to unauthorized page
                if ( window.location.pathname !== '/unauthorized'   &&
                window.location.pathname !== '/auth/signin') {
                    window.location.replace('/unauthorized');
                }
            } else if ( payload.status === 403 ) {
                // Forbidden - redirect to forbidden page
                console.warn('403 Forbidden - No permission to access this resource.');
                if ( window.location.pathname !== '/forbidden' ) {
                    window.location.replace('/forbidden');
                }
            } else if ( payload.status === 404 ) {
                // Not found
                console.warn('404 Not found - Page not found.');

            } else if ( payload.status === 500 ) {
                // Server errors
                console.error('500 Internal server error: ', payload );
            }
        }

        return next(action);
    };