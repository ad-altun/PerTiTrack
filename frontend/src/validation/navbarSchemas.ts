import { z } from "zod";

export const navSchema = z.object({
    profileName: z.string(),
    activePage: z.string().optional(),
});

export type NavbarProps = z.infer<typeof navSchema>;
