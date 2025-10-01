import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TodaySummaryProps } from "../../validation/todaySummarySchema.ts";
import type { ProtocolEntry } from "../../validation/protocolEntrySchema.ts";
import type { TimeTrackState } from "../../validation/timeTrackStateSchema.ts";
import type { LocationType } from "../../validation/timetrackSchemas.ts";

const initialState: TimeTrackState = {
    todaySummary: {
        arrivalTime: null,
        departureTime: null,
        breakTime: '',
        workingTime: "",
        flexTime: "",
        status: 'Not Started',
        isWorking: false,
        isOnBreak: false,
    },
    protocolEntries: [],
    currentStatus: 'Not Started',
    isLoading: false,
    error: null,
    focusWorkNotes: false,
    lastEntryId: null,
};

const timeTrackSlice = createSlice({
    name: 'timeTrack',
    initialState,
    reducers: {
        // set loading state
        setLoading: ( state, action: PayloadAction<boolean> ) => {
            state.isLoading = action.payload;
        },

        // set error state
        setError: ( state, action: PayloadAction<string | null> ) => {
            state.error = action.payload;
        },

        // Clock In Action
        clockIn: ( state, action: PayloadAction<{
            locationType: LocationType; notes?: string
        }> ) => {
            const now = new Date();
            const timeString =now.toISOString();  // "2025-09-20T17:01:45.123Z"
            const dateString =now.toISOString().split('T')[0];  // "2025-09-20"

            // update today's summary
            // (only set arrival time if it's the first clock in of the day)
            if ( !state.todaySummary.arrivalTime ) {
                state.todaySummary.arrivalTime = timeString;
            }
            state.todaySummary.status = 'Working';
            state.todaySummary.isWorking = true;
            state.todaySummary.isOnBreak = false;
            state.currentStatus = 'Working';

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                // TODO: decide to id style
                // id: crypto.randomUUID(),
                id: `clock-in-${ Date.now() }`,
                date: dateString,
                time: timeString,
                recordType: 'CLOCK_IN',
                locationType: action.payload.locationType,
                terminal: 'Web Terminal',
                notes: action.payload.notes || 'Clock in via web terminal',
                isManual: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            state.protocolEntries.unshift(newEntry); // Add to beginning of array
            state.lastEntryId = newEntry.id;
            // Focus work summary for editing
            state.focusWorkNotes = true;
        },

        // Clock Out Action
        clockOut: ( state, action: PayloadAction<{ notes?: string }> ) => {
            const now = new Date();
            const timeString =now.toISOString();  // "2025-09-20T17:01:45.123Z"
            const dateString =now.toISOString().split('T')[0];  // "2025-09-20"

            // Update Today's Summary
            state.todaySummary.departureTime = timeString;
            state.todaySummary.status = 'Finished';
            state.todaySummary.isWorking = false;
            state.todaySummary.isOnBreak = false;
            state.currentStatus = 'Finished';

            // calculate working time
            // todo: constraints can be added (e.g., <10h, <12h)
            if ( state.todaySummary.arrivalTime && state.todaySummary.departureTime ) {
                const arrivalTime = new Date(state.todaySummary.arrivalTime);
                const departureTime = new Date(state.todaySummary.departureTime);
                const workingTime = departureTime.getTime() - arrivalTime.getTime();
                state.todaySummary.workingTime = timeString;
            }

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                // todo: decide
                // id: crypto.randomUUID(),
                id: `clock-in-${ Date.now() }`,
                date: dateString,
                time: timeString,
                recordType: 'CLOCK_OUT',
                // todo: forgot at backend api, so 'office' is default
                // or use a selector
                locationType: 'OFFICE',
                terminal: 'Web Terminal',
                notes: action.payload.notes || 'Clock in via web terminal',
                isManual: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            state.protocolEntries.unshift(newEntry);
            state.lastEntryId = newEntry.id;
            state.focusWorkNotes = true;
        },

        // Start Break Action
        startBreak: (state, action: PayloadAction<{ notes?: string }>) => {
            const now = new Date();
            const timeString =now.toISOString();  // "2025-09-20T17:01:45.123Z"
            const dateString =now.toISOString().split('T')[0];  // "2025-09-20"

            // Update Today's Summary
            state.todaySummary.status = 'Break';
            state.todaySummary.isOnBreak = true;
            state.currentStatus = 'Break';

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                id: `break-start-${Date.now()}`,
                date: dateString,   // ISO date format
                time: timeString,   // ISO datetime format
                recordType: 'BREAK_START',
                locationType: 'OFFICE',
                terminal: 'Web Terminal',
                notes: action.payload.notes || 'Break started',
                isManual: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            state.protocolEntries.unshift(newEntry);
            state.lastEntryId = newEntry.id;
            state.focusWorkNotes = true;
        },

        // End Break Action
        endBreak: (state, action: PayloadAction<{ notes?: string }>) => {
            const now = new Date();
            const timeString =now.toISOString();  // "2025-09-20T17:01:45.123Z"
            const dateString =now.toISOString().split('T')[0];  // "2025-09-20"

            // Update Today's Summary
            state.todaySummary.status = 'Working';
            state.todaySummary.isOnBreak = false;
            state.currentStatus = 'Working';

            // Add a new protocol entry
            const newEntry: ProtocolEntry = {
                // id: crypto.randomUUID(),
                id: `break-end-${Date.now()}`,
                date: dateString,
                time: timeString,
                recordType: 'BREAK_END',
                locationType: 'OFFICE',
                terminal: 'Web Terminal',
                notes: action.payload.notes || 'Break ended',
                isManual: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            state.protocolEntries.unshift(newEntry);
            state.lastEntryId = newEntry.id;
            state.focusWorkNotes = true;
        },

        // Update protocol entry work summary
        updateWorkNotes: (state, action: PayloadAction<{ id: string; notes: string }>) => {
            const entry = state.protocolEntries.find(entry => entry.id === action.payload.id);
            if (entry) {
                entry.notes = action.payload.notes;
                entry.updatedAt = new Date().toISOString();
            }
        },

        // Set focus for notes input
        setFocusWorkNotes: ( state, action: PayloadAction<boolean> ) => {
            state.focusWorkNotes = action.payload;
        },

        // Update working time (this would typically be called by a timer or from API)
        updateWorkingTime: ( state, action: PayloadAction<string> ) => {
            state.todaySummary.workingTime = action.payload;
        },

        // Update break time
        updateBreakTime: ( state, action: PayloadAction<string> ) => {
            state.todaySummary.breakTime = action.payload;
        },

        // Update flex time
        updateFlexTime: ( state, action: PayloadAction<string> ) => {
            state.todaySummary.flexTime = action.payload;
        },

        // Load initial data
        loadTodayData: (state, action: PayloadAction<{
            summary: TodaySummaryProps; entries: ProtocolEntry[] }> ) =>
        {
            state.todaySummary = action.payload.summary;
            state.protocolEntries = action.payload.entries;
            state.currentStatus = action.payload.summary.status;
        },

        // Change location type (for home office, business trip, etc.)
        changeLocationType: (state, action: PayloadAction<{ locationType: LocationType; notes?: string }>) => {
            const now = new Date();
            const timeString =now.toISOString();  // "2025-09-20T17:01:45.123Z"
            const dateString =now.toISOString().split('T')[0];  // "2025-09-20"

            // Add protocol entry for location change
            const newEntry: ProtocolEntry = {
                id: crypto.randomUUID(),
                date: dateString,
                time: timeString,
                recordType: 'CLOCK_IN', // Location change is treated as clock in with different location
                locationType: action.payload.locationType,
                terminal: 'Web Terminal',
                notes: action.payload.notes || `Location changed to ${action.payload.locationType}`,
                isManual: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            state.protocolEntries.unshift(newEntry);
            state.lastEntryId = newEntry.id;
            state.focusWorkNotes = true;
        },
    },
});

export const {
    setLoading,
    setError,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    updateWorkNotes,
    setFocusWorkNotes,
    loadTodayData,
    changeLocationType,
} = timeTrackSlice.actions;

export default timeTrackSlice.reducer;
