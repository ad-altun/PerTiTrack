import { z } from 'zod';
import { protocolEntrySchema } from './protocolEntrySchema';
import { todaysSummarySchema } from './todaysSummarySchema';

// TimeTrack State Schema
export const timeTrackStateSchema = z.object({
    todaySummary: todaysSummarySchema,
    protocolEntries: z.array(protocolEntrySchema).default([]),
    isBreakEnabled: z.boolean().default(false),
    focusWorkSummary: z.boolean().default(false),
});

// Type inference from schema
export type TimeTrackState = z.infer<typeof timeTrackStateSchema>;

// Re-export types for convenience
export type { TodaysSummaryProps as TodaySummary } from './todaysSummarySchema';
export type { ProtocolEntry } from './protocolEntrySchema';