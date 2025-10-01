import { z } from 'zod';
import type { todaySummaryResponseSchema } from "./todaySummarySchema.ts";

// Enums
export const recordTypeSchema = z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END']);
export const locationTypeSchema = z.enum(['OFFICE', 'HOME', 'BUSINESS_TRIP', 'CLIENT_SITE']);
export const absenceStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

// Time Record Schemas
export const timeRecordSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    employeeFirstName: z.string().min(1, 'Employee first name is required'),
    employeeLastName: z.string().min(1, 'Employee last name is required'),
    recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    // DateTime in YYYY-MM-DDTHH:mm:ss format (no milliseconds to match backend)
    recordTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:mm:ss format'),
    recordType: recordTypeSchema,
    locationType: locationTypeSchema,
    notes: z.string().nullable(),
    isManual: z.boolean(),
    // Timestamps in YYYY-MM-DDTHH:mm:ss format (consistent with backend @JsonFormat)
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'CreatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'UpdatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
});

export const createTimeRecordSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    recordTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:mm:ss format'),
    recordType: recordTypeSchema,
    locationType: locationTypeSchema,
    notes: z.string().optional().nullable(),
    isManual: z.boolean().default(false),
});

export const updateTimeRecordSchema = z.object({
    recordTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:mm:ss format'),
    locationType: locationTypeSchema.optional(),
    notes: z.string().optional(),
    isManual: z.boolean().optional(),
});

// Work Schedule Schemas
export const workScheduleSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    dayOfWeek: z.number().min(1).max(7),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Start time must be in HH:MM:SS format'),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'End time must be in HH:MM:SS format'),
    breakDurationMinutes: z.number().min(0),
    isWorkingDay: z.boolean(),
    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    effectiveUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    isActive: z.boolean(),
});

export const createWorkScheduleSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    dayOfWeek: z.number().min(1).max(7),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Start time must be in HH:MM:SS format'),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'End time must be in HH:MM:SS format'),
    breakDurationMinutes: z.number().min(0),
    isWorkingDay: z.boolean(),
    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    effectiveUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Absence Schemas
export const absenceTypeSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    description: z.string(),
    requiresApproval: z.boolean(),
    affectsVacationBalance: z.boolean(),
    isPaid: z.boolean(),
    colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color code must be a valid hex color'),
    isActive: z.boolean(),
});

export const absenceSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    employeeFirstName: z.string().min(1, 'Employee first name is required'),
    employeeLastName: z.string().min(1, 'Employee last name is required'),
    absenceTypeId: z.string().min(1, 'Absence type ID is required'),
    absenceTypeName: z.string().min(1, 'Absence type name is required'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').nullable(),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').nullable(),
    status: absenceStatusSchema,
    reason: z.string(),
    rejectionReason: z.string().nullable(),
    createdAt: z.string(),
});

// Dashboard Schemas
export const employeeDashboardSummarySchema = z.object({
    todayStatus: z.object({
        isClockedIn: z.boolean(),
        clockInTime: z.string().nullable(),
        clockOutTime: z.string().nullable(),
        currentWorkingHours: z.number(),
        breakTime: z.number(),
    }),
    weekSummary: z.object({
        totalHoursThisWeek: z.number(),
        expectedHours: z.number(),
        remainingHours: z.number(),
    }),
});

// a separate schema for request validation that only validates the notes
export const quickActionNotesSchema = z.object({
    notes: z.string().optional().nullable(),
});

// Zod schemas for API responses
export const timeRecordResponseSchema = z.object({
    id: z.string(),
    employeeId: z.string(),
    employeeFirstName: z.string(),
    employeeLastName: z.string(),
    recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    recordTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:mm:ss format'),
    recordType: recordTypeSchema,
    locationType: locationTypeSchema,
    notes: z.string().nullable(),
    isManual: z.boolean(),
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'CreatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'UpdatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
});

export const currentStatusResponseSchema = z.object({
    isWorking: z.boolean(),
    isOnBreak: z.boolean(),
    currentLocation: z.string(),
    lastEntry: timeRecordSchema.nullable(),
});

export const quickActionRequestSchema = z.object({
    recordType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END']),
    notes: z.string().optional(),
    locationType: z.enum(['OFFICE', 'HOME', 'BUSINESS_TRIP', 'CLIENT_SITE']).optional(),
});

// Enhanced request type with location
export interface EnhancedQuickActionRequest extends QuickActionRequest {
    locationType?: 'OFFICE' | 'HOME' | 'BUSINESS_TRIP' | 'CLIENT_SITE';
}

export type TimeRecordResponse = z.infer<typeof timeRecordResponseSchema>;
export type QuickActionRequest = z.infer<typeof quickActionRequestSchema>;
export type CurrentStatusResponse = z.infer<typeof currentStatusResponseSchema>;
export type TodaySummaryResponse = z.infer<typeof todaySummaryResponseSchema>;

// Helper functions for time formatting

export const getCurrentISODateTime = (): string => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:mm:ss (no milliseconds)
    return now.toISOString().slice(0, 19);
};

export const getCurrentISODate = (): string => {
    const now = new Date();
    // Format as YYYY-MM-DD
    return now.toISOString().slice(0, 10);
};

// Array schemas
export const timeRecordListSchema = z.array(timeRecordSchema);
export const workScheduleListSchema = z.array(workScheduleSchema);


// Type inference from schemas
export type CurrentStatus = z.infer<typeof currentStatusResponseSchema>;
export type RecordType = z.infer<typeof recordTypeSchema>;
export type LocationType = z.infer<typeof locationTypeSchema>;

export type TimeRecord = z.infer<typeof timeRecordSchema>;
export type CreateTimeRecordRequest = z.infer<typeof createTimeRecordSchema>;
export type UpdateTimeRecordRequest = z.infer<typeof updateTimeRecordSchema>;

export type WorkSchedule = z.infer<typeof workScheduleSchema>;
export type CreateWorkScheduleRequest = z.infer<typeof createWorkScheduleSchema>;

export type AbsenceType = z.infer<typeof absenceTypeSchema>;
export type Absence = z.infer<typeof absenceSchema>;

export type EmployeeDashboardSummary = z.infer<typeof employeeDashboardSummarySchema>;
