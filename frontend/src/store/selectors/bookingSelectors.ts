import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { bookingPanelSchema, bookingUiSchema } from "../../validation/bookingPanelSchema.ts";

// Base user selector - validates and returns the entire user or null
export const selectValidatedRealTime = createSelector(
    [(state: RootState) => state.workspace.realTime ],
    (realTime) => {
        const result = bookingPanelSchema.safeParse( realTime );
        return result.success ? result.data : null;
    }
);

export const selectValidatedUiState = createSelector(
    [(state: RootState) => state.workspace.ui ],
    (ui) => {
        const result = bookingUiSchema.safeParse( ui );
        return result.success ? result.data : null;
    }
);

// specific field selectors - reuses the validated user
// -------------------------------------------------------
// real time selectors
export const selectLocalTime = createSelector(
    [selectValidatedRealTime ],
    (realTime) => realTime?.localTime || '-:-:-'
);

export const selectLocalDate = createSelector(
    [selectValidatedRealTime],
    (realTime) => realTime?.localDate || '-'
)

// ui selectors
export const selectBookingType = createSelector(
    [selectValidatedUiState],
    (validatedUi) => validatedUi?.protocolFilters?.bookingType
);

export const selectEmployeeName = createSelector(
    [selectValidatedRealTime],
    (realTime) => realTime?.employeeName || 'Guest'
)