import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TimeRecord } from '../../validation/timetrackSchemas';
import { timetrackApi } from '../api/timetrackApi';

interface TodaySummary {
    arrivalTime: string | null;
    breakTime: string;
    workingTime: string;
    flexTime: string;
    status: 'Not Started' | 'Working' | 'On Break' | 'Finished';
    isClockedIn: boolean;
    currentClockInTime: string | null;
}

interface ProtocolEntry {
    id: string;
    date: string;
    time: string;
    booking: string;
    bookingType: 'arrival' | 'break' | 'departure';
    terminal: string;
    workSummary: string;
}

interface TimeTrackState {
    todaySummary: TodaySummary;
    protocolEntries: ProtocolEntry[];
    isBreakEnabled: boolean;
    focusWorkSummary: boolean;
}

const initialState: TimeTrackState = {
    todaySummary: {
        arrivalTime: null,
        breakTime: "00:00:00",
        workingTime: "00:00:00",
        flexTime: "+00:00:00",
        status: 'Not Started',
        isClockedIn: false,
        currentClockInTime: null,
    },
    protocolEntries: [],
    isBreakEnabled: false,
    focusWorkSummary: false,
};

const timeTrackSlice = createSlice({
    name: 'timeTrack',
    initialState,
    reducers: {
        // Clock In Action
        clockIn: (state, action: PayloadAction<{ time: string; notes?: string }>) => {
            const currentTime = action.payload.time;
            const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format

            // Update Today's Summary - only set arrival time if it's the first clock in of the day
            if (!state.todaySummary.arrivalTime) {
                state.todaySummary.arrivalTime = currentTime;
            }
            state.todaySummary.status = 'Working';
            state.todaySummary.isClockedIn = true;
            state.todaySummary.currentClockInTime = currentTime;

            // Enable Break button
            state.isBreakEnabled = true;

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                id: `clock-in-${Date.now()}`,
                date: currentDate,
                time: currentTime,
                booking: 'A0 Arrival',
                bookingType: 'arrival',
                terminal: 'Web Terminal',
                workSummary: action.payload.notes || 'Clock in via web terminal'
            };

            state.protocolEntries.unshift(newEntry); // Add to beginning of array

            // Focus work summary for editing
            state.focusWorkSummary = true;
        },

        // Clock Out Action
        clockOut: (state, action: PayloadAction<{ time: string; notes?: string }>) => {
            const currentTime = action.payload.time;
            const currentDate = new Date().toLocaleDateString('en-GB');

            // Update Today's Summary
            state.todaySummary.status = 'Finished';
            state.todaySummary.isClockedIn = false;
            state.todaySummary.currentClockInTime = null;

            // Disable Break button
            state.isBreakEnabled = false;

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                id: `clock-out-${Date.now()}`,
                date: currentDate,
                time: currentTime,
                booking: 'C0 Departure',
                bookingType: 'departure',
                terminal: 'Web Terminal',
                workSummary: action.payload.notes || 'Clock out via web terminal'
            };

            state.protocolEntries.unshift(newEntry);
            state.focusWorkSummary = true;
        },

        // Break Start Action
        startBreak: (state, action: PayloadAction<{ time: string; notes?: string }>) => {
            const currentTime = action.payload.time;
            const currentDate = new Date().toLocaleDateString('en-GB');

            // Update Today's Summary
            state.todaySummary.status = 'On Break';

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                id: `break-start-${Date.now()}`,
                date: currentDate,
                time: currentTime,
                booking: 'B1 Break Start',
                bookingType: 'break',
                terminal: 'Web Terminal',
                workSummary: action.payload.notes || 'Break started'
            };

            state.protocolEntries.unshift(newEntry);
            state.focusWorkSummary = true;
        },

        // Break End Action
        endBreak: (state, action: PayloadAction<{ time: string; notes?: string }>) => {
            const currentTime = action.payload.time;
            const currentDate = new Date().toLocaleDateString('en-GB');

            // Update Today's Summary
            state.todaySummary.status = 'Working';

            // Add new protocol entry
            const newEntry: ProtocolEntry = {
                id: `break-end-${Date.now()}`,
                date: currentDate,
                time: currentTime,
                booking: 'B2 Break End',
                bookingType: 'break',
                terminal: 'Web Terminal',
                workSummary: action.payload.notes || 'Break ended'
            };

            state.protocolEntries.unshift(newEntry);
            state.focusWorkSummary = true;
        },

        // Update protocol entry work summary
        updateWorkSummary: (state, action: PayloadAction<{ id: string; workSummary: string }>) => {
            const entry = state.protocolEntries.find(entry => entry.id === action.payload.id);
            if (entry) {
                entry.workSummary = action.payload.workSummary;
            }
        },

        // Clear focus on work summary
        clearWorkSummaryFocus: (state) => {
            state.focusWorkSummary = false;
        },

        // Update working time (this would typically be called by a timer or from API)
        updateWorkingTime: (state, action: PayloadAction<string>) => {
            state.todaySummary.workingTime = action.payload;
        },

        // Update break time
        updateBreakTime: (state, action: PayloadAction<string>) => {
            state.todaySummary.breakTime = action.payload;
        },

        // Update flex time
        updateFlexTime: (state, action: PayloadAction<string>) => {
            state.todaySummary.flexTime = action.payload;
        },

        // Load initial data (from API or localStorage)
        loadInitialData: (state, action: PayloadAction<{
            todaySummary: Partial<TodaySummary>;
            protocolEntries: ProtocolEntry[]
        }>) => {
            state.todaySummary = { ...state.todaySummary, ...action.payload.todaySummary };
            state.protocolEntries = action.payload.protocolEntries;
            state.isBreakEnabled = state.todaySummary.isClockedIn;
        },
    },
    extraReducers: (builder) => {
        // Handle successful clock in API call
        builder.addMatcher(
            timetrackApi.endpoints.quickClockIn.matchFulfilled,
            (state, action) => {
                const timeRecord = action.payload;
                const currentTime = new Date(timeRecord.recordTime).toLocaleTimeString('en-GB', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                // Update state based on API response
                if (!state.todaySummary.arrivalTime) {
                    state.todaySummary.arrivalTime = currentTime;
                }
                state.todaySummary.status = 'Working';
                state.todaySummary.isClockedIn = true;
                state.todaySummary.currentClockInTime = currentTime;
                state.isBreakEnabled = true;

                // Update or add protocol entry
                const existingEntryIndex = state.protocolEntries.findIndex(
                    entry => entry.id === `clock-in-${timeRecord.id}`
                );

                if (existingEntryIndex === -1) {
                    const newEntry: ProtocolEntry = {
                        id: `clock-in-${timeRecord.id}`,
                        date: new Date(timeRecord.recordDate).toLocaleDateString('en-GB'),
                        time: currentTime,
                        booking: 'A0 Arrival',
                        bookingType: 'arrival',
                        terminal: 'Web Terminal',
                        workSummary: timeRecord.notes || 'Clock in via web terminal'
                    };
                    state.protocolEntries.unshift(newEntry);
                    state.focusWorkSummary = true;
                }
            }
        );

        // Handle successful clock out API call
        builder.addMatcher(
            timetrackApi.endpoints.quickClockOut.matchFulfilled,
            (state, action) => {
                const timeRecord = action.payload;
                const currentTime = new Date(timeRecord.recordTime).toLocaleTimeString('en-GB', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                // Update state based on API response
                state.todaySummary.status = 'Finished';
                state.todaySummary.isClockedIn = false;
                state.todaySummary.currentClockInTime = null;
                state.isBreakEnabled = false;

                // Add protocol entry
                const newEntry: ProtocolEntry = {
                    id: `clock-out-${timeRecord.id}`,
                    date: new Date(timeRecord.recordDate).toLocaleDateString('en-GB'),
                    time: currentTime,
                    booking: 'C0 Departure',
                    bookingType: 'departure',
                    terminal: 'Web Terminal',
                    workSummary: timeRecord.notes || 'Clock out via web terminal'
                };
                state.protocolEntries.unshift(newEntry);
                state.focusWorkSummary = true;
            }
        );
    },
});

export const {
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    updateWorkSummary,
    clearWorkSummaryFocus,
    updateWorkingTime,
    updateBreakTime,
    updateFlexTime,
    loadInitialData,
} = timeTrackSlice.actions;

export default timeTrackSlice.reducer;
