import { z } from 'zod';

export const statusSchema = z.enum(['Not Started', 'Working', 'Break', 'Finished']);

export const todaySummarySchema = z.object({
    arrivalTime: z.string().nullable(),
    departureTime: z.string().nullable(),
    breakTime: z.string(),
    workingTime: z.string(),
    flexTime: z.string(),
    status: statusSchema,
    isWorking: z.boolean(),
    isOnBreak: z.boolean(),
});

// Type inference from schema
export type TodaySummaryProps = z.infer<typeof todaySummarySchema>;
export type Status = z.infer<typeof statusSchema>;
