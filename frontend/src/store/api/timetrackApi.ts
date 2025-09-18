import { baseApi } from './baseApi';
import {
    timeRecordSchema,
    timeRecordListSchema,
    createTimeRecordSchema,
    updateTimeRecordSchema,
    workScheduleSchema,
    workScheduleListSchema,
    createWorkScheduleSchema,
    absenceSchema,
    absenceListSchema,
    createAbsenceSchema,
    rejectAbsenceSchema,
    absenceTypeSchema,
    absenceTypeListSchema,
    employeeDashboardSummarySchema,
    quickActionSchema,
} from '../../validation/timetrackSchemas';
import type {
    TimeRecord,
    CreateTimeRecordRequest,
    UpdateTimeRecordRequest,
    WorkSchedule,
    CreateWorkScheduleRequest,
    Absence,
    CreateAbsenceRequest,
    RejectAbsenceRequest,
    AbsenceType,
    EmployeeDashboardSummary,
    QuickActionRequest,
} from '../../validation/timetrackSchemas';

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

interface AbsenceQueryParams {
    status?: string;
    employeeId?: string;
    startDate?: string;
    endDate?: string;
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
                const validatedData = createTimeRecordSchema.parse(timeRecordData);
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

        // ===== ABSENCES =====

        // Get all absences
        getAllAbsences: builder.query<Absence[], AbsenceQueryParams>({
            query: (params = {}) => ({
                url: '/timetrack/absences',
                params,
            }),
            transformResponse: (response: unknown) => absenceListSchema.parse(response),
            providesTags: ['Absence'],
        }),

        // Get absences for specific employee
        getEmployeeAbsences: builder.query<Absence[], string>({
            query: (employeeId) => `/timetrack/absences/employee/${employeeId}`,
            transformResponse: (response: unknown) => absenceListSchema.parse(response),
            providesTags: (result, error, employeeId) => [
                { type: 'Absence', id: `employee-${employeeId}` },
                'Absence',
            ],
        }),

        // Get current user's absences
        getMyAbsences: builder.query<Absence[], void>({
            query: () => '/timetrack/absences/my-absences',
            transformResponse: (response: unknown) => absenceListSchema.parse(response),
            providesTags: ['Absence', 'MyAbsence'],
        }),

        // Create absence request
        createAbsence: builder.mutation<Absence, CreateAbsenceRequest>({
            query: (absenceData) => {
                const validatedData = createAbsenceSchema.parse(absenceData);
                return {
                    url: '/timetrack/absences',
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => absenceSchema.parse(response),
            invalidatesTags: ['Absence', 'MyAbsence', 'Dashboard'],
        }),

        // Update absence request
        updateAbsence: builder.mutation<Absence, { id: string; absenceData: CreateAbsenceRequest }>({
            query: ({ id, absenceData }) => {
                const validatedData = createAbsenceSchema.parse(absenceData);
                return {
                    url: `/timetrack/absences/${id}`,
                    method: 'PUT',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => absenceSchema.parse(response),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Absence', id },
                'Absence',
                'MyAbsence',
                'Dashboard',
            ],
        }),

        // Reject absence request
        rejectAbsence: builder.mutation<Absence, { id: string; rejectionData: RejectAbsenceRequest }>({
            query: ({ id, rejectionData }) => {
                const validatedData = rejectAbsenceSchema.parse(rejectionData);
                return {
                    url: `/timetrack/absences/${id}/reject`,
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => absenceSchema.parse(response),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Absence', id },
                'Absence',
                'Dashboard',
            ],
        }),

        // Get absence types
        getAbsenceTypes: builder.query<AbsenceType[], void>({
            query: () => '/timetrack/absence-types',
            transformResponse: (response: unknown) => absenceTypeListSchema.parse(response),
            providesTags: ['AbsenceType'],
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
        quickClockIn: builder.mutation<TimeRecord, QuickActionRequest>({
            query: (actionData) => {
                const validatedData = quickActionSchema.parse(actionData);
                return {
                    url: '/time-bookings/clock-in',
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => timeRecordSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),

        // Quick clock out
        quickClockOut: builder.mutation<TimeRecord, QuickActionRequest>({
            query: (actionData) => {
                const validatedData = quickActionSchema.parse(actionData);
                return {
                    url: '/time-bookings/clock-out',
                    method: 'POST',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => timeRecordSchema.parse(response),
            invalidatesTags: ['TimeRecord', 'MyTimeRecord', 'Dashboard'],
        }),
    }),
    overrideExisting: false,
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

    // Work Schedules
    useGetEmployeeWorkSchedulesQuery,
    useCreateWorkScheduleMutation,
    useUpdateWorkScheduleMutation,

    // Absences
    useGetAllAbsencesQuery,
    useGetEmployeeAbsencesQuery,
    useGetMyAbsencesQuery,
    useCreateAbsenceMutation,
    useUpdateAbsenceMutation,
    useRejectAbsenceMutation,
    useGetAbsenceTypesQuery,

    // Dashboard
    useGetEmployeeDashboardQuery,

    // Quick Actions
    useQuickClockInMutation,
    useQuickClockOutMutation,
} = timetrackApi;