import { z } from 'zod';

// Booking Panel Schema
export const bookingPanelSchema = z.object({
    localDate: z.string().min(1, 'Local date is required').default('01/22/2025'),
    localTime: z.string().min(1, 'Local time is required').default('09:15:42'),
    timeZone: z.string().min(1, 'Time zone is required').default('GMT +01:00 (Berlin)'),
    bookingType: z.string().min(1, 'Booking type is required').default('B1 Arrival'),
    employeeName: z.string().min(1, 'Employee name is required').default('Jane, Patrick (00293)'),
});

// Type inference from schema
export type BookingPanelProps = z.infer<typeof bookingPanelSchema>;