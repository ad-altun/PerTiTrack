import { z } from "zod";

// Zod schema for props
export const headerSchema = z.object({
    portalName: z.string().default("Employee Portal"),
});

export type HeaderProps = z.infer<typeof headerSchema>;
