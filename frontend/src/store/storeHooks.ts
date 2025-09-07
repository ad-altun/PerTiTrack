export { store, type RootState, type AppDispatch } from './store';

// Export auth slice actions
export {
    loginStart,
    // loginSuccess,
    // loginFailure,
    logout,
    updateUser,
} from './slices/authSlice';

// Export RTK Query hooks
export {
    useLoginMutation,
    useRegisterMutation,
    // useForgotPasswordMutation,
    // useResetPasswordMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
} from './api/authApi.ts';

// Export types from the types directory
// (not from store to avoid circular deps)
export type {
    LoginRequest,
    SignupRequest,
    JwtResponse,
    MessageResponse,
    AuthState,

} from '../types/authTypes';

// Export validation schemas
export {
    loginSchema,
    registerSchema,
    // forgotPasswordSchema,
    // resetPasswordSchema,
} from '../validation/authSchemas.ts';