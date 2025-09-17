import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { navSchema } from "../../validation/navbarSchemas.ts";

export const selectActivePage = createSelector(
    [ ( state: RootState ) => state.workspace.navigation.activePage ],
    ( activePage ) => {
        const result = navSchema.safeParse({ activePage });
        return result.success ? result.data.activePage : 'HomePage';
    }
);

export const selectUserProfileName = createSelector(
    [ ( state: RootState ) => state.auth.user?.profileName ],
    ( profileName ) => {
        const result = navSchema.safeParse({ profileName });
        return result.success ? result.data.profileName : 'Guest';
    }
);