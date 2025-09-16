import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export type PageType = 'HomePage' | 'Timesheet';
export type LocationType = 'office' | 'home' | 'business_trip' | null;
export type ActionButtonType = 'clockIn' | 'break' | 'cancel' | 'homeOffice' | 'businessTrip' | 'query';

interface WorkStatus {
    isClockedIn: boolean;
    isOnBreak: boolean;
    locationType: LocationType;
    clockInTime: string | null;
    breakStartTime: string | null;
    lastActionTime: string | null;
    currentRecordId: string | null;
}

interface ProtocolFilters {
    selectedEmployee: string;
    selectedDate: string;
    searchTerm: string;
    timePeriod: 'today' | 'thisWeek' | 'thisMonth' | 'custom';
    bookingType: 'all' | 'arrival' | 'break' | 'departure';
}

interface UIState {
    editingProtocolId: string | null;
    showProtocolModal: boolean;
    selectedTimeRecordId: string | null;
    protocolFilters: ProtocolFilters;
    isLoading: boolean;
    lastRefreshTime: string | null;
}

interface WorkspaceState {
    // Navigation
    navigation: {
        activePage: PageType;
        previousPage: PageType | null;
    };

    // Current Work Status
    workStatus: WorkStatus;

    // UI States
    ui: UIState;

    // Real-time updates
    realTime: {
        localTime: string;
        autoRefreshEnabled: boolean;
        refreshInterval: number; // in seconds
    };
}

// Initial state
const initialState: WorkspaceState = {
    navigation: {
        activePage: 'HomePage',
        previousPage: null,
    },

    workStatus: {
        isClockedIn: false,
        isOnBreak: false,
        locationType: null,
        clockInTime: null,
        breakStartTime: null,
        lastActionTime: null,
        currentRecordId: null,
    },

    ui: {
        editingProtocolId: null,
        showProtocolModal: false,
        selectedTimeRecordId: null,
        protocolFilters: {
            selectedEmployee: '',
            selectedDate: new Date().toISOString().split('T')[0], // Today's date
            searchTerm: '',
            timePeriod: 'today',
            bookingType: 'all',
        },
        isLoading: false,
        lastRefreshTime: null,
    },

    realTime: {
        localTime: new Date().toISOString(),
        autoRefreshEnabled: true,
        refreshInterval: 1, // 1 second
    },
};

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        // ===== NAVIGATION ACTIONS =====

        setActivePage: (state, action: PayloadAction<PageType>) => {
            state.navigation.previousPage = state.navigation.activePage;
            state.navigation.activePage = action.payload;
        },

        // ===== WORK STATUS ACTIONS =====

        clockIn: (state, action: PayloadAction<{ time: string; recordId: string; locationType?: LocationType }>) => {
            const { time, recordId, locationType = 'office' } = action.payload;
            state.workStatus.isClockedIn = true;
            state.workStatus.clockInTime = time;
            state.workStatus.lastActionTime = time;
            state.workStatus.currentRecordId = recordId;
            state.workStatus.locationType = locationType;
            state.workStatus.isOnBreak = false;
            state.workStatus.breakStartTime = null;
        },

        clockOut: (state, action: PayloadAction<{ time: string }>) => {
            state.workStatus.isClockedIn = false;
            state.workStatus.isOnBreak = false;
            state.workStatus.clockInTime = null;
            state.workStatus.breakStartTime = null;
            state.workStatus.lastActionTime = action.payload.time;
            state.workStatus.currentRecordId = null;
            state.workStatus.locationType = null;
        },

        startBreak: (state, action: PayloadAction<{ time: string }>) => {
            if (state.workStatus.isClockedIn) {
                state.workStatus.isOnBreak = true;
                state.workStatus.breakStartTime = action.payload.time;
                state.workStatus.lastActionTime = action.payload.time;
            }
        },

        endBreak: (state, action: PayloadAction<{ time: string }>) => {
            state.workStatus.isOnBreak = false;
            state.workStatus.breakStartTime = null;
            state.workStatus.lastActionTime = action.payload.time;
        },

        setLocationType: (state, action: PayloadAction<LocationType>) => {
            if (state.workStatus.isClockedIn) {
                state.workStatus.locationType = action.payload;
                state.workStatus.lastActionTime = new Date().toISOString();
            }
        },

        // Update work status from API response (for synchronization)
        syncWorkStatus: (state, action: PayloadAction<Partial<WorkStatus>>) => {
            state.workStatus = { ...state.workStatus, ...action.payload };
        },

        // ===== UI STATE ACTIONS =====

        setEditingProtocolId: (state, action: PayloadAction<string | null>) => {
            state.ui.editingProtocolId = action.payload;
        },

        setShowProtocolModal: (state, action: PayloadAction<boolean>) => {
            state.ui.showProtocolModal = action.payload;
        },

        setSelectedTimeRecordId: (state, action: PayloadAction<string | null>) => {
            state.ui.selectedTimeRecordId = action.payload;
        },

        updateProtocolFilters: (state, action: PayloadAction<Partial<ProtocolFilters>>) => {
            state.ui.protocolFilters = { ...state.ui.protocolFilters, ...action.payload };
        },

        resetProtocolFilters: (state) => {
            state.ui.protocolFilters = initialState.ui.protocolFilters;
        },

        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.ui.isLoading = action.payload;
        },

        setLastRefreshTime: (state, action: PayloadAction<string>) => {
            state.ui.lastRefreshTime = action.payload;
        },

        // ===== REAL-TIME ACTIONS =====

        updateLocalTime: (state, action: PayloadAction<string>) => {
            state.realTime.localTime = action.payload;
        },

        setAutoRefresh: (state, action: PayloadAction<boolean>) => {
            state.realTime.autoRefreshEnabled = action.payload;
        },

        setRefreshInterval: (state, action: PayloadAction<number>) => {
            state.realTime.refreshInterval = action.payload;
        },

        // ===== BULK ACTIONS =====

        resetWorkspace: (state) => {
            // Keep navigation state but reset everything else
            const currentPage = state.navigation.activePage;
            return {
                ...initialState,
                navigation: {
                    ...initialState.navigation,
                    activePage: currentPage,
                },
            };
        },
    },
});

// Action creators
export const {
    // Navigation
    setActivePage,

    // Work Status
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    setLocationType,
    syncWorkStatus,

    // UI State
    setEditingProtocolId,
    setShowProtocolModal,
    setSelectedTimeRecordId,
    updateProtocolFilters,
    resetProtocolFilters,
    setIsLoading,
    setLastRefreshTime,

    // Real-time
    updateLocalTime,
    setAutoRefresh,
    setRefreshInterval,

    // Bulk
    resetWorkspace,
} = workspaceSlice.actions;

// Selectors - Section
// -------------------------------

// Basic Selectors
export const selectActivePage = (state: { workspace: WorkspaceState }) =>
    state.workspace.navigation.activePage;

export const selectPreviousPage = (state: { workspace: WorkspaceState}) =>
    state.workspace.navigation.previousPage;

export const selectWorkStatus = (state: { workspace: WorkspaceState }) =>
    state.workspace.workStatus;

export const selectProtocolFilters = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters;

export const selectUIState = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui;

export const selectRealTime = (state: { workspace: WorkspaceState }) =>
    state.workspace.realTime;

// work status selectors
export const selectIsClockedIn = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.isClockedIn;

export const selectIsOnBreak = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.isOnBreak;

export const selectLocationType = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.locationType;

export const selectClockInTime = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.clockInTime;

export const selectBreakStartTime = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.breakStartTime;

export const selectCurrentRecordId = (state: { workspace: WorkspaceState})=>
    state.workspace.workStatus.currentRecordId;

// ui state selectors
export const selectEditingProtocolId = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.editingProtocolId;

export const selectShowProtocolModal = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.showProtocolModal;

export const selectSelectedTimeRecordId = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.selectedTimeRecordId;

export const selectIsLoading = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.isLoading;

export const selectLastRefreshTime = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.lastRefreshTime;

// filter selectors

export const selectSelectedEmployee = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters.selectedEmployee;

export const selectSelectedDate = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters.selectedDate;

export const selectSearchTerm = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters.searchTerm;

export const selectTimePeriod = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters.timePeriod;

export const selectBookingType = (state: { workspace: WorkspaceState }) =>
    state.workspace.ui.protocolFilters.bookingType;

// real-time selectors
export const selectLocalTime = (state: { workspace: WorkspaceState }) =>
    state.workspace.realTime.localTime;

export const selectAutoRefreshEnabled = (state: { workspace: WorkspaceState }) =>
    state.workspace.realTime.autoRefreshEnabled;

export const selectRefreshInterval = (state: { workspace: WorkspaceState }) =>
    state.workspace.realTime.refreshInterval;

// Complex selectors for button states
export const selectActionButtonStates = (state: { workspace: WorkspaceState }) => {
    const { isClockedIn, isOnBreak, locationType } = state.workspace.workStatus;

    return {
        clockIn: {
            active: isClockedIn,
            text: isClockedIn ? 'Clock Out' : 'Clock In',
            disabled: false,
        },
        break: {
            active: isOnBreak,
            text: isOnBreak ? 'End Break' : 'Break',
            disabled: !isClockedIn,
        },
        cancel: {
            active: false,
            text: 'Cancel',
            disabled: !isClockedIn && !isOnBreak,
        },
        homeOffice: {
            active: locationType === 'home',
            text: 'Home Office',
            disabled: !isClockedIn,
        },
        businessTrip: {
            active: locationType === 'business_trip',
            text: 'Business Trip',
            disabled: !isClockedIn,
        },
        query: {
            active: false,
            text: 'Query',
            disabled: false,
        },
    };
};

// Selector for current work session info
export const selectCurrentSession = (state: { workspace: WorkspaceState }) => {
    const { workStatus, realTime } = state.workspace;

    if (!workStatus.isClockedIn || !workStatus.clockInTime) {
        return {
            isWorking: false,
            totalHours: 0,
            breakTime: 0,
            currentStatus: 'clocked_out' as const,
        };
    }

    const clockInTime = new Date(workStatus.clockInTime);
    const currentTime = new Date(realTime.localTime);
    const totalMilliseconds = currentTime.getTime() - clockInTime.getTime();

    // Calculate break time if on break
    let breakMilliseconds = 0;
    if (workStatus.isOnBreak && workStatus.breakStartTime) {
        const breakStartTime = new Date(workStatus.breakStartTime);
        breakMilliseconds = currentTime.getTime() - breakStartTime.getTime();
    }

    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    const breakTime = breakMilliseconds / (1000 * 60 * 60);

    let currentStatus: 'working' | 'on_break' | 'clocked_out' = 'working';
    if (workStatus.isOnBreak) {
        currentStatus = 'on_break';
    }

    return {
        isWorking: true,
        totalHours: Math.max(0, totalHours),
        breakTime: Math.max(0, breakTime),
        currentStatus,
        workingHours: Math.max(0, totalHours - breakTime),
        clockInTime: workStatus.clockInTime,
        locationType: workStatus.locationType,
    };
};

export default workspaceSlice.reducer;