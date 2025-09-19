import { z } from 'zod';
import { protocolEntrySchema } from './protocolEntrySchema';
import { statusSchema, todaySummarySchema } from './todaySummarySchema.ts';

// TimeTrack State Schema
export const timeTrackStateSchema = z.object({
    todaySummary: todaySummarySchema,
    protocolEntries: z.array(protocolEntrySchema).default([]),
    currentStatus: statusSchema,
    isLoading: z.boolean().default(false),
    error: z.string().nullable(),
    focusWorkNotes: z.boolean().default(false),
    lastEntryId: z.string().nullable(),
});

// Type inference from schema
export type TimeTrackState = z.infer<typeof timeTrackStateSchema>;
