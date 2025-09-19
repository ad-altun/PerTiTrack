import { z } from 'zod';

// Booking Panel Schema
export const bookingPanelSchema = z.object({
    localDate: z.string().min(1, 'Local date is required').default('01/22/2025'),
    localTime: z.string().min(1, 'Local time is required').default('09:15:42'),
    bookingType: z.string().min(1, 'Booking type is required').default('Clock Out'),
    employeeName: z.string().min(1, 'Employee name is required').default('Jane, Patrick (00293)'),
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
        bookingType: z.string().default('Clock Out'),
    }),
    isLoading: z.boolean().default(false),
    lastRefreshTime: z.string().nullable().or(z.null()),
})

// export const bookingInfoSchema = z.object({
//     id: z.string(),
//     email: z.email(),
//     firstName: z.string(),
//     lastName: z.string(),
//     roles: z.array(z.string()),
// });

// Type inference from schema
export type BookingPanelProps = z.infer<typeof bookingPanelSchema>;
export type BookingUiProps = z.infer<typeof bookingUiSchema>;