import { z } from "zod";

// Zod schema for props
export const headerSchema = z.object({
    portalName: z.string().default("Employee Portal"),
});

export const navSchema = z.object({
    activePage: z.string().optional(),
});

export type HeaderProps = z.infer<typeof headerSchema>;
export type NavbarProps = z.infer<typeof navSchema>;
