import { z } from 'zod';

// Today's Summary Schema
export const todaysSummarySchema = z.object({
    arrivalTime: z.string().nullable().default(null),
    breakTime: z.string().default('00:00:00'),
    workingTime: z.string().default('00:00:00'),
    flexTime: z.string().default('+00:00:00'),
    status: z.enum([
        'Not Started', 'Working', 'On Break', 'Finished'
    ]).default('Not Started'),
    isClockedIn: z.boolean().default(true),
    currentClockInTime: z.string().nullable().default(null),
});

// Type inference from schema
export type TodaysSummaryProps = z.infer<typeof todaysSummarySchema>;

// Alias for consistency with the interface naming
export type TodaySummary = TodaySummaryProps;