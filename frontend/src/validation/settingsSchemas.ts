import { z } from 'zod';

export const passwordChangeSchema = z.object({
    currentPassword: z.string()
        .min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password cannot exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z.string()
        .min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
})

export type PasswordChange = z.infer<typeof passwordChangeSchema>;
