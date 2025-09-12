import { z } from 'zod';

// login validation schema
export const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

// register validation schema
export const registerSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(1, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(1, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: [ "confirmPassword" ],
});

// API (backend) response schemas for runtime validation
export const jwtResponseSchema = z.object({
    token: z.string(),
    type: z.string().default('Bearer'),
    id: z.uuid(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(z.string()),
});

// forgot/reset password
export const forgotPasswordSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required')
        .max(100, 'Token cannot exceed 100 characters'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
});

export const messageResponseSchema = z.object({
    message: z.string(),
});

export const userSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(z.string()),
});

// API Error schema for error handling
export const apiErrorSchema = z.object({
    message: z.string(),
    status: z.number().optional(),
    errors: z.array(z.string()).optional(),
});

// auth state schema for storage validation
export const authStateSchema = z.object({
    user: userSchema.nullable(),
    token: z.string().nullable(),
    isAuthenticated: z.boolean(),
});

// Type inference from schema
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type JwtResponse = z.infer<typeof jwtResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type User = z.infer<typeof userSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
// export type StoredAuthState = z.infer<typeof authStateSchema>;


