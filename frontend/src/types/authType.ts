export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface MessageResponse {
    message: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}