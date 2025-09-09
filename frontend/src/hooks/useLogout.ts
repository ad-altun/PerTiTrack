import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/authApi.ts";
import { useAppDispatch } from "../store/hook.ts";
import { clearCredentials } from "../store/slices/authSlice.ts";

export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [ logoutMutation, { isLoading, error, isSuccess } ] = useLogoutMutation();


    const logout = async () => {
        try {
            await logoutMutation().unwrap();

            dispatch(clearCredentials());
        }
        catch (error) {
            console.error('Logout failed: ', error);

            dispatch(clearCredentials());
            navigate('/auth/signin');
        }

        if ( isSuccess ) {
            navigate('/auth/signin');
        }

        return {
            logout,
            // isLoading,
            // error,
            // isSuccess,
        };
    };
};