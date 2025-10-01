import { baseApi } from './baseApi';
import {
    timeRecordSchema,
    timeRecordListSchema,
    createTimeRecordSchema,
    updateTimeRecordSchema,
    workScheduleSchema,
    workScheduleListSchema,
    createWorkScheduleSchema,
    employeeDashboardSummarySchema,
    timeRecordResponseSchema,
    getCurrentISODateTime,
    getCurrentISODate,
    type TodaySummaryResponse,
    currentStatusResponseSchema, type CurrentStatusResponse, quickActionNotesSchema,
} from '../../validation/timetrackSchemas';
import type {
    TimeRecordResponse,
    CreateTimeRecordRequest,
    UpdateTimeRecordRequest,
    WorkSchedule,
    CreateWorkScheduleRequest,
    EmployeeDashboardSummary,
    QuickActionRequest,
    EnhancedQuickActionRequest,
    TimeRecord
} from '../../validation/timetrackSchemas';
import { todaySummaryResponseSchema } from "../../validation/todaySummarySchema.ts";

// Query parameters interfaces
interface TimeRecordQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
}

interface EmployeeTimeRecordQueryParams {
    startDate?: string;
    endDate?: string;
    recordType?: string;
}

interface WorkScheduleQueryParams {
    date?: string;
    startDate?: string;
    endDate?: string;
}


export const timetrackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ===== TIME RECORDS =====
        // Get all time records
        getAllTimeRecords: builder.query<TimeRecord[], TimeRecordQueryParams>({
            query: (params = {}) => ({
                url: '/timetrack/time-records',
                params,
            }),
            transformResponse: (response: unknown) => timeRecordListSchema.parse(response),
            providesTags: ['TimeRecord'],
        }),

        // Get time record by ID
        getTimeRecordById: builder.query<TimeRecord, string>({
            query: (id) => `/timetrack/time-records/${id}`,
            transformResponse: (response: unknown) => timeRecordSchema.parse(response),
            providesTags: (result, error, id) => [{ type: 'TimeRecord', id }],
        }),

        // Get time records for specific employee
        getEmployeeTimeRecords: builder.query<TimeRecord[], { employeeId: string } & EmployeeTimeRecordQueryParams>({
            query: ({ employeeId, ...params }) => ({
                url: `/timetrack/time-records/employee/${employeeId}`,
                params,
            }),
            transformResponse: (response: unknown) => timeRecordListSchema.parse(response),
            providesTags: (result, error, { employeeId }) => [
                { type: 'TimeRecord', id: `employee-${employeeId}` },
                'TimeRecord',
            ],
        }),

        // Get current user's time records
        getMyTimeRecords: builder.query<TimeRecord[], EmployeeTimeRecordQueryParams>({
            query: (params = {}) => ({
                url: '/timetrack/time-records/my-records',
                params,
            }),
            transformResponse: (response: unknown) => timeRecordListSchema.parse(response),
            providesTags: ['TimeRecord', 'MyTimeRecord'],
        }),

        // Create time record
        createTimeRecord: builder.mutation<TimeRecord, CreateTimeRecordRequest>({
            query: (timeRecordData) => {
                const validatedData = createTimeRecordSchema.parse({
                    ...timeRecordData,
                    recordDate: timeRecordData.recordDate || getCurrentISODate(),
                    recordTime: timeRecordData.recordTime || getCurrentISODateTime(),
                });
                return {
                    url: '/timetrack/time-records',
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => timeRecordSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // Update time record
        updateTimeRecord: builder.mutation<TimeRecord, { id: string; timeRecordData: UpdateTimeRecordRequest }>({
            query: ({ id, timeRecordData }) => {
                const validatedData = updateTimeRecordSchema.parse(timeRecordData);
                return {
                    url: `/timetrack/time-records/${id}`,
                    method: 'PUT',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => timeRecordSchema.parse(response),
            invalidatesTags: (result, error, { id }) => [
                { type: 'TimeRecord', id },
                'TimeRecord',
                'MyTimeRecord',
                'Dashboard',
            ],
        }),

        // Delete time record
        deleteTimeRecord: builder.mutation<void, string>({
            query: (id) => ({
                url: `/timetrack/time-records/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // ===== WORK SCHEDULES =====

        // Get work schedules for employee
        getEmployeeWorkSchedules: builder.query<WorkSchedule[], { employeeId: string } & WorkScheduleQueryParams>({
            query: ({ employeeId, ...params }) => ({
                url: `/timetrack/work-schedules/employee/${employeeId}`,
                params,
            }),
            transformResponse: (response: unknown) => workScheduleListSchema.parse(response),
            providesTags: (result, error, { employeeId }) => [
                { type: 'WorkSchedule', id: `employee-${employeeId}` },
                'WorkSchedule',
            ],
        }),

        // Create work schedule
        createWorkSchedule: builder.mutation<WorkSchedule, CreateWorkScheduleRequest>({
            query: (scheduleData) => {
                const validatedData = createWorkScheduleSchema.parse(scheduleData);
                return {
                    url: '/timetrack/work-schedules',
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => workScheduleSchema.parse(response),
            invalidatesTags: ['WorkSchedule'],
        }),

        // Update work schedule
        updateWorkSchedule: builder.mutation<WorkSchedule, { id: string; scheduleData: CreateWorkScheduleRequest }>({
            query: ({ id, scheduleData }) => {
                const validatedData = createWorkScheduleSchema.parse(scheduleData);
                return {
                    url: `/timetrack/work-schedules/${id}`,
                    method: 'PUT',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => workScheduleSchema.parse(response),
            invalidatesTags: (result, error, { id }) => [
                { type: 'WorkSchedule', id },
                'WorkSchedule',
            ],
        }),

        // ===== DASHBOARD =====

        // Get employee dashboard summary
        getEmployeeDashboard: builder.query<EmployeeDashboardSummary, void>({
            query: () => '/dashboard/employee-summary',
            transformResponse: (response: unknown) => employeeDashboardSummarySchema.parse(response),
            providesTags: ['Dashboard', 'EmployeeDashboard'],
        }),

        // ===== QUICK ACTIONS =====
        // Quick clock in
        quickClockIn: builder.mutation<TimeRecordResponse, EnhancedQuickActionRequest>({
            query: (request) => {
                return {
                    url: '/timetrack/time-records/time-bookings/clock-in',
                    method: 'POST',
                    body: {
                        recordType: 'CLOCK_IN',
                        notes: request.notes,
                        locationType: request.locationType || 'OFFICE',
                        recordDate: getCurrentISODate(),
                        recordTime: getCurrentISODateTime(),
                    },
                };
            },
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // Quick clock out
        quickClockOut: builder.mutation<TimeRecordResponse, Pick<QuickActionRequest, 'notes'>>({
            query: (request) => {
                const validatedDate = quickActionNotesSchema.parse(request)
                return {
                    url: '/timetrack/time-records/time-bookings/clock-out',
                    method: 'POST',
                    body: {
                        recordType: 'CLOCK_OUT',
                        notes: validatedDate.notes,
                    },
                };
            },
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // Quick break start
        quickBreakStart: builder.mutation<TimeRecordResponse, Pick<QuickActionRequest, 'notes'>>({
            query: (request) => {
                const validatedData = quickActionNotesSchema.parse(request);
                return {
                    url: '/timetrack/time-records/time-bookings/break-start',
                    method: 'POST',
                    body: {
                        recordType: "BREAK_START",
                        notes: validatedData.notes,
                    },
                };
            },
            transformResponse: (response: unknown) => {
                // console.log("Raw response >>>", response);
                return timeRecordResponseSchema.parse(response);
            },
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(timetrackApi.util.invalidateTags(['Dashboard']));
                } catch (error) {
                    console.error('Break start failed:', error);
                }
            },
        }),

        // Quick break end
        quickBreakEnd: builder.mutation<TimeRecordResponse, Pick<QuickActionRequest, 'notes'>>({
            query: (request) => {
                const validatedData = quickActionNotesSchema.parse(request);
                return {
                    url: '/timetrack/time-records/time-bookings/break-end',
                    method: 'POST',
                    body: {
                        recordType: 'BREAK_END',
                        notes: validatedData.notes,
                    },
                };
            },
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // location specific clock in actions
        // --------------------------------
        // Quick home office
        clockInHome: builder.mutation<TimeRecordResponse, Pick<QuickActionRequest, 'notes'>>({
            query: (request) => {
                const validatedData = quickActionNotesSchema.parse(request);
                return {
                    url: '/timetrack/time-records/time-bookings/clock-in/home',
                    method: 'POST',
                    body: {
                        recordType: 'CLOCK_IN',
                        notes: validatedData.notes || 'Home office work started',
                        locationType: 'HOME',
                    },
                };
            },
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),


        // // Quick business trip
        clockInBusinessTrip: builder.mutation<TimeRecordResponse, Pick<QuickActionRequest, 'notes'>>({
            query: (request) => {
                const validatedData = quickActionNotesSchema.parse(request);
                return {
                    url: '/timetrack/time-records/time-bookings/clock-in/business-trip',
                    method: 'POST',
                    body: {
                        recordType: 'CLOCK_IN',
                        notes: validatedData.notes || 'Business trip work started',
                        locationType: 'BUSINESS_TRIP',
                    },
                };
            },
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // Get today's time records with proper transformation
        getTodayTimeRecords: builder.query<TimeRecordResponse[], void>({
            query: () => ({
                url: '/timetrack/time-records/today',
                method: 'GET',
            }),
            transformResponse: (response: unknown) => {
                // Ensure it's an array and validate each record
                const recordsArray = Array.isArray(response) ? response : [];
                return recordsArray.map(record => timeRecordResponseSchema.parse(record));
            },
            providesTags: ['TimeRecord', 'MyTimeRecord'],
        }),

        // Get time records for a specific date
        getTimeRecordsByDate: builder.query<TimeRecordResponse[], string>({
            query: (date) => ({
                url: '/timetrack/time-records/my-records',
                params: {
                    startDate: date,
                    endDate: date,
                },
            }),
            transformResponse: (response: unknown) => {
                const recordsArray = Array.isArray(response) ? response : [];
                return recordsArray.map(record => timeRecordResponseSchema.parse(record));
            },
            providesTags: ['TimeRecord', 'MyTimeRecord'],
        }),

        // Get current status with updated schema
        getCurrentStatus: builder.query<CurrentStatusResponse, void>({
            query: () => ({
                url: '/timetrack/status/current',
                method: 'GET',
            }),
            transformResponse: (response: unknown) => currentStatusResponseSchema.parse(response),
            providesTags: ['TimeRecord', 'Dashboard'],
        }),

        // Update time record notes
        updateTimeRecordNotes: builder.mutation<TimeRecordResponse, {
            id: string;
            notes: string;
        }>({
            query: ({ id, notes }) => ({
                url: `/timetrack/time-records/${id}/notes`,
                method: 'PATCH',
                body: { notes },
            }),
            transformResponse: (response: unknown) => timeRecordResponseSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord'],
        }),

        // Get today's summary with updated schema
        getTodaySummary: builder.query<TodaySummaryResponse, void>({
            query: () => ({
                url: '/timetrack/summary/today',
                method: 'GET',
            }),
            transformResponse: (response: unknown) => todaySummaryResponseSchema.parse(response),
            providesTags: ['Dashboard', 'MyTimeRecord'],
            keepUnusedDataFor: 0,
        }),

    }),
});


// Export hooks for usage in functional components
export const {
    // Time Records
    useGetAllTimeRecordsQuery,
    useGetTimeRecordByIdQuery,
    useGetEmployeeTimeRecordsQuery,
    useGetMyTimeRecordsQuery,
    useCreateTimeRecordMutation,
    useUpdateTimeRecordMutation,
    useDeleteTimeRecordMutation,
    useGetCurrentStatusQuery,
    useGetTodaySummaryQuery,

    useGetTodayTimeRecordsQuery,
    useGetTimeRecordsByDateQuery,
    useUpdateTimeRecordNotesMutation,

    // Work Schedules
    useGetEmployeeWorkSchedulesQuery,
    useCreateWorkScheduleMutation,
    useUpdateWorkScheduleMutation,
    // Dashboard
    useGetEmployeeDashboardQuery,

    // Quick Actions
    useQuickClockInMutation,
    useQuickClockOutMutation,
    useQuickBreakStartMutation,
    useQuickBreakEndMutation,
    useClockInHomeMutation,
    useClockInBusinessTripMutation,
} = timetrackApi;