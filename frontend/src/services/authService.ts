import type {JwtResponse, LoginRequest, SignupRequest, User} from "../types/authType.ts";
import api from "./api.ts";


const login = async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/signin', credentials);

    return response.data;
}

const register = async (userData: SignupRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/signup', userData);

    return response.data;
}

const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
}

const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
}

const isAuthenticated = (): boolean => {
    const token: string | null = getToken();
    const user: User | null = getCurrentUser();
    return !!(token && user);
}

const setAuthData = (jwtResponse: JwtResponse): void => {
    localStorage.setItem('accessToken', jwtResponse.token);

    const user: User = {
        id: jwtResponse.id,
        email: jwtResponse.email,
        firstName: jwtResponse.firstName,
        lastName: jwtResponse.lastName,
        roles: jwtResponse.roles,
    };

    localStorage.setItem('user', JSON.stringify(user));
};
export {
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
    isAuthenticated,
    setAuthData
}


