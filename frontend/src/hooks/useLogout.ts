import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/authApi.ts";
import { useAppDispatch } from "../store/hook.ts";
import { clearCredentials } from "../store/slices/authSlice.ts";
import { useCallback } from "react";

export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [ logoutMutation, { isLoading, error } ] = useLogoutMutation();

    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
        }
        catch (error) {
            console.error('Logout failed: ', error);
        } finally {
            dispatch(clearCredentials());
            navigate('/auth/signin');
        }
    }, [ logoutMutation, dispatch, navigate ]);
    return {
        logout,
        isLoading,
        error,
    };
};
