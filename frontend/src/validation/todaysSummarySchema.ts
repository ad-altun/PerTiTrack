import { z } from 'zod';

// Today's Summary Schema
export const todaysSummarySchema = z.object({
    arrivalTime: z.string().min(1, 'Arrival time is required').default('08:17:09'),
    breakTime: z.string().min(1, 'Break time is required').default('12:30:15 - 13:30:25'),
    workingTime: z.string().min(1, 'Working time is required').default('07:59:51'),
    flexTime: z.string().min(1, 'Flex time is required').default('+00:29:51'),
    status: z.string().min(1, 'Status is required').default('Working'),
});

// Type inference from schema
export type TodaysSummaryProps = z.infer<typeof todaysSummarySchema>;