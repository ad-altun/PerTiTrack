// src/store/hooks.ts
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store.ts';
import { clearCredentials, setCredentials } from './slices/authSlice';
import { useEffect, useMemo, useRef } from "react";
import { STORAGE_KEYS } from "../constants/storage";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Token validation utility
const isTokenValid = ( token: string ): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[ 1 ]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    }
    catch {
        return false;
    }
};

// auth hook with automatic token validation
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(( state ) => state.auth);
    const initialized = useRef(false);

    // only run initialization once
    useEffect(() => {
        // Sync localStorage with Redux on app start
        if ( !initialized.current && !auth.token ) {
            initialized.current = true;
            const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

            if ( storedToken && storedUser ) {
                try {
                    if ( isTokenValid(storedToken) ) {
                        // Restore valid token to Redux
                        const user = JSON.parse(storedUser);
                        dispatch(setCredentials({
                            token: storedToken,
                            ...user
                        }));
                    } else {
                        // Clear expired token
                        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                    }
                }
                catch (error) {
                    // Clear corrupted data
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                }
            }
        }
    }, [ dispatch, auth.token ]);

    // memoize computed values (for preformance)
    const computedAuth = useMemo(() => {
        const isValid = auth.token ? isTokenValid(auth.token) : false;
        return {
            ...auth,
            isAuthenticated: auth.isAuthenticated && isValid,
            isTokenExpired: !isValid,
        };
    }, [ auth ]);

    // only check token expiration when token changes
    // Auto-logout on token expiration
    useEffect(() => {
        if ( auth.token && !isTokenValid(auth.token) ) {
            dispatch(clearCredentials());
        }
    }, [ auth.token, dispatch ]);

    return {

        // ...auth,
        // Computed values
        // isAuthenticated: auth.isAuthenticated && auth.token && isTokenValid(auth.token),

        ...computedAuth,
        // Helper methods
        logout: () => dispatch(clearCredentials()),

        // Token validation
        // isTokenExpired: auth.token ? !isTokenValid(auth.token) : true,
    };
};

// Simplified hooks for common use cases
export const useIsAuthenticated = () => {
    const auth = useAppSelector((state) => state.auth);
    return useMemo(() => {
        return auth.isAuthenticated && auth.token && isTokenValid(auth.token);
    }, [ auth.isAuthenticated, auth.token ]);
    // const { isAuthenticated } = useAuth();
    // return isAuthenticated;
};

export const useCurrentUser = () => {
    const { user } = useAuth();
    return user;
};

export const useAuthToken = () => {
    const { token } = useAuth();
    return token;
};