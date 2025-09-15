import { z } from 'zod';

// Action Types
export const actionTypeSchema = z.enum([
    'clockIn',
    'break',
    'cancel',
    'homeOffice',
    'businessTrip',
    'query'
]);

export type ActionType = z.infer<typeof actionTypeSchema>;

// Action Buttons Schema
export const actionButtonsSchema = z.object({
    activeAction: actionTypeSchema.default('clockIn'),
    onActionClick: z.function({
        input: [actionTypeSchema],
        output: z.void()
    })

});

// Type inference from schema
export type ActionButtonsProps = z.infer<typeof actionButtonsSchema>;