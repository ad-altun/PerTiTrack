import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { userSchema } from "../../validation/authSchemas.ts";
import { employeeSchema } from "../../validation/employeeSchemas.ts";

// Base user selector - validates and returns the entire user or null
export const selectValidatedUser = createSelector(
    [(state: RootState) => state.auth.user ],
    (user) => {
        const result = userSchema.safeParse( user );
        return result.success ? result.data : null;
    }
);

export const selectValidatedEmployee = createSelector(
    [(state: RootState) => state.auth.user ],
    (user) => {
        const result = employeeSchema.safeParse( user );
        return result.success ? result.data : null;
    }
);

// specific field selectors - reuses the validated user
// -------------------------------------------------------
export const selectUserLastName = createSelector(
    [selectValidatedUser ],
    (user) => user?.lastName || 'Guest'
);

// employee info selectors
export const selectUserFirstName = createSelector(
    [selectValidatedUser ],
    (user) => user?.firstName || 'Guest'
);