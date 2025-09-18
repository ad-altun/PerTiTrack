import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store';

// Base timetrack selector - direct access to avoid validation issues
export const selectTimeTrackState = (state: RootState) => state.timeTrack;

// Direct selectors for today's summary fields with proper null handling
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

export const selectIsClockedIn = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.isClockedIn || false
);

export const selectCurrentClockIn = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.todaySummary?.currentClockInTime || null
);

// Protocol entries selector
export const selectProtocolEntries = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.protocolEntries || []
);

// Break enabled selector
export const selectIsBreakEnabled = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.isBreakEnabled || false
);

// Focus work summary selector
export const selectFocusWorkSummary = createSelector(
    [selectTimeTrackState],
    (timeTrack) => timeTrack?.focusWorkSummary || false
);