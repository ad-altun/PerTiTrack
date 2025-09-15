import { z } from 'zod';

// Welcome Section Schema
export const welcomeSectionSchema = z.object({
    userName: z.string().min(1, 'User name is required').default('Mr. Jane'),
});

// Type inference from schema
export type WelcomeSectionProps = z.infer<typeof welcomeSectionSchema>;