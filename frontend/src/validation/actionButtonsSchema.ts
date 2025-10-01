import { z } from 'zod';

// Action Types
export const actionTypeSchema = z.enum([
    'CLOCK_IN',
    'CLOCK_OUT',
    'BREAK_START',
    'BREAK_END',
    'HOME',
    'BUSINESS_TRIP',
]);

// Action Buttons Schema
export const actionButtonsSchema = z.object({
    // activeAction: actionTypeSchema.default('clockIn'),
    onActionComplete: z.function({
        input: [ actionTypeSchema ],
        output: z.void()
    })

});

// Workflow button schemas
export const workflowTypeSchema = z.enum([
    'workflow',
    'balance',
]);

export const workflowButtonProps = z.object({
    type: workflowTypeSchema,
    onClick: z.function({
        input: [],
        output: z.void()
    }),
    disabled: z.boolean().default(false),
    isActive: z.boolean().default(false),
});

export const workflowButtonGroupSchema = z.object({
    onWorkflowClick: z.function({
        input: [],
        output: z.void()
    }),
    onBalanceClick: z.function({
        input: [],
        output: z.void()
    }),
    activeButton: workflowTypeSchema.nullable().optional(),
    disabledButtons: z.array(workflowTypeSchema).optional(),
})

// Type inference from schema
export type ActionButtonsProps = z.infer<typeof actionButtonsSchema>;
export type ActionType = z.infer<typeof actionTypeSchema>;
export type WorkflowType = z.infer<typeof workflowTypeSchema>;
export type WorkflowButtonProps = z.infer<typeof workflowButtonProps>;
export type WorkflowButtonGroupProps = z.infer<typeof workflowButtonGroupSchema>;