import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store';

// Base timetrack selector - direct access to avoid validation issues
export const selectTimeTrackState = (state: RootState) => state.timeTrack;

// Direct selectors for today's summary fields with proper null handling
// ------------------------------------------------------------------------
// todaySummary selectors
export const selectArrivalTime = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.arrivalTime || null
);

export const selectBreakTime = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.breakTime || "00:00:00"
);

export const selectWorkingTime = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.workingTime || "00:00:00"
);

export const selectFlexTime = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.flexTime || "+00:00:00"
);

export const selectStatus = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.status || 'Not Started'
);


// Protocol entries selector
export const selectProtocolEntries = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.protocolEntries || []
);


// Focus work summary selector
export const selectFocusWorkSummary = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.focusWorkSummary || false
);

// currentStatus selectors
export const selectCurrentStatus = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.currentStatus || 'Not Started'
);