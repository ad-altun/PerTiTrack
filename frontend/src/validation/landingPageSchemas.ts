import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .regex(/^[a-zA-ZäöüÄÖÜß\s'-]+$/, 'Name contains invalid characters'),
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[\d\s+()-]+$/.test(val),
            'Phone number contains invalid characters'
        ),
    subject: z.enum(['general', 'support', 'sales', 'demo', 'feedback'], {
        message: 'Please select a subject',
    }),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message cannot exceed 1000 characters'),
});

// Newsletter subscription schema (optional for future use)
export const newsletterSchema = z.object({
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
});

// Type inference
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;