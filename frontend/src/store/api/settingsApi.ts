import { baseApi } from "./baseApi.ts";
import type { PasswordChange } from "../../validation/settingsSchemas.ts";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // privacy tab
        changePassword: builder.mutation<
            { message: string },
            { userId: string; passwords: PasswordChange }
        > ({
            query: ({ userId, passwords }) => ({
                url: `/settings/users/${userId}/change-password`,
                method: 'PUT',
                body: passwords,
            })
        })
    }),
});

export const {
    useChangePasswordMutation,
} = settingsApi;