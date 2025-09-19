import { z } from 'zod';
import { recordTypeSchema, locationTypeSchema,  } from './timetrackSchemas';

// Protocol Entry Schema
export const protocolEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    time: z.string(),
    // booking: z.string(),
    recordType: recordTypeSchema,
    locationType: locationTypeSchema,
    // bookingType: z.enum(['arrival', 'break', 'departure']),
    terminal: z.string(),
    notes: z.string(),
    // workSummary: z.string(),
    isManual: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Booking Protocol Schema
export const bookingProtocolSchema = z.object({
    protocols: z.array(protocolEntrySchema).default([]),
});

// Type inference from schemas
export type ProtocolEntry = z.infer<typeof protocolEntrySchema>;
export type BookingProtocolProps = z.infer<typeof bookingProtocolSchema>;