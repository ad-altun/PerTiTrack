import { z } from 'zod';

// Protocol Entry Schema
export const protocolEntrySchema = z.object({
    id: z.string().min(1, 'ID is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    booking: z.string().min(1, 'Booking is required'),
    bookingType: z.enum(['arrival', 'break', 'departure']),
    terminal: z.string().min(1, 'Terminal is required'),
    workSummary: z.string().min(1, 'Work summary is required'),
});

// Booking Protocol Schema
export const bookingProtocolSchema = z.object({
    protocols: z.array(protocolEntrySchema).default([]),
});

// Type inference from schemas
export type ProtocolEntry = z.infer<typeof protocolEntrySchema>;
export type BookingProtocolProps = z.infer<typeof bookingProtocolSchema>;