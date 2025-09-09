export const getStoredAuth = () => {
    const authData = localStorage.getItem('token') ||
        sessionStorage.getItem('token');

    return authData ? JSON.parse(authData) : null;
};

export const isTokenValid = ( token: string ): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[ 1 ]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    }
    catch {
        return false;
    }
};

export const checkAuth = (): { isAuthenticated: boolean; token: string | null } => {
    const authData = getStoredAuth();
    if ( authData ) {
        return {
            isAuthenticated: isTokenValid(authData.token),
            token: authData.token
        };
    }

    // cleanup expired/invalid
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return { isAuthenticated: false, token: null };
};