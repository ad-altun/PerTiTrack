import { authApi } from "./api/authApi.ts";
import type { AuthState } from "../types/authTypes.ts";


export interface RootState {
    auth: AuthState;
    [ authApi.reducerPath ]: ReturnType<typeof authApi.reducer>;
}