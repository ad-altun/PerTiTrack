import { z } from "zod";

// Zod schema for props
export const headerSchema = z.object({
    userName: z.string(),
    portalName: z.string().default("Employee Portal"),
    activePage: z.string().optional(),
});

export const navSchema = z.object({
    userName: z.string(),
    activePage: z.string().optional(),
});

export type HeaderProps = z.infer<typeof headerSchema>;
export type NavbarProps = z.infer<typeof navSchema>;
