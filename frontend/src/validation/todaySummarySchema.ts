import { z } from 'zod';

export const statusSchema = z.enum(['Not Started', 'Working', 'Break', 'Finished']);

export const todaySummarySchema = z.object({
    arrivalTime: z.string().nullable(),      // HH:mm:ss format from backend
    departureTime: z.string().nullable(),    // HH:mm:ss format from backend
    breakTime: z.string(),                   // HH:mm:ss format from backend
    workingTime: z.string(),                 // HH:mm:ss format from backend
    flexTime: z.string(),                    // HH:mm:ss format from backend
    status: statusSchema,                    // HH:mm:ss format from backend
    isWorking: z.boolean(),                  // HH:mm:ss format from backend
    isOnBreak: z.boolean(),                  // HH:mm:ss format from backend
});

// Updated Dashboard Schemas to match backend TodaySummaryResponse
export const todaySummaryResponseSchema = z.object({
    arrivalTime: z.string().nullable(),     // HH:mm:ss format or null
    departureTime: z.string().nullable(),   // HH:mm:ss format or null
    breakTime: z.string(),                  // HH:mm:ss format
    workingTime: z.string(),                // HH:mm:ss format
    flexTime: z.string(),                   // ±HH:mm:ss format
    status: z.string(),                     // Status string
    isWorking: z.boolean(),                 // Added to match updated backend
    isOnBreak: z.boolean(),                 // Added to match updated backend
});

// Type inference from schema
export type TodaySummaryProps = z.infer<typeof todaySummarySchema>;
export type TodaySummaryResponseProps = z.infer<typeof todaySummaryResponseSchema>;