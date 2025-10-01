import { z } from 'zod';

// Booking Panel Schema
export const bookingPanelSchema = z.object({
    localDate: z.string(),
    localTime: z.string(),
    bookingType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END']),
    employeeName: z.string().min(1, 'Employee name is required'),
});

export const bookingUiSchema = z.object({
    editingProtocolId: z.string().nullable(),
    showProtocolModal: z.boolean().default(false),
    selectedTimeRecordId: z.string().nullable(),
    protocolFilters: z.object({
        selectedEmployee: z.string().default(''),
        selectedDate: z.string(), // Today's date
        searchTerm: z.string().default(''),
        timePeriod: z.string().default('today'),
        bookingType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END']),
    }),
    isLoading: z.boolean().default(false),
    lastRefreshTime: z.string().nullable().or(z.null()),
})

// Type inference from schema
export type BookingPanelProps = z.infer<typeof bookingPanelSchema>;
export type BookingUiProps = z.infer<typeof bookingUiSchema>;