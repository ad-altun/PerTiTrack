import {z} from 'zod';

// Employee Schema
export const employeeSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    employeeNumber: z.string().min(1, 'Employee number is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    fullName: z.string().min(1, 'Full name is required'),
    isActive: z.boolean(),
    userId: z.string().min(1, 'User ID is required'),
    userEmail: z.email('Invalid email format'),
    userFullName: z.string().min(1, 'User full name is required'),
});

// Create Employee Request Schema
export const createEmployeeSchema = z.object({
    employeeNumber: z.string().min(1, 'Employee number is required'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    userId: z.string().min(1, 'User ID is required').optional(),
});

// Update Employee Request Schema
export const updateEmployeeSchema = z.object({
    employeeNumber: z.string().min(1, 'Employee number is required'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    isActive: z.boolean(),
});

// Employee API Response Schema
export const employeeListSchema = z.array(employeeSchema);

// Type inference from schemas
export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeRequest = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeRequest = z.infer<typeof updateEmployeeSchema>;
export type EmployeeList = z.infer<typeof employeeListSchema>;