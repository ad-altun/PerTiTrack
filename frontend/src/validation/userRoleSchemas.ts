import { z } from 'zod';

// Base UserRole schema for API responses
export const userRoleSchema = z.object({
    id: z.string('Invalid UUID format'),
    name: z.string().min(1, 'Role name is required'),
    description: z.string().nullable(),
    permissions: z.string().nullable(),
    createdAt: z.iso.datetime('Invalid date format'),
});

// Schema for role search/filtering
export const userRoleSearchSchema = z.object({
    searchTerm: z
        .string()
        .max(100, 'Search term cannot exceed 100 characters')
        .optional(),
    permissions: z
        .string()
        .max(100, 'Permission name cannot exceed 100 characters')
        .optional(),
    page: z
        .number()
        .int('Page must be an integer')
        .min(0, 'Page cannot be negative')
        .default(0),
    size: z
        .number()
        .int('Size must be an integer')
        .min(1, 'Size must be at least 1')
        .max(100, 'Size cannot exceed 100')
        .default(10),
    sortBy: z
        .enum(['name', 'description', 'createdAt'])
        .default('name'),
    sortDir: z
        .enum(['asc', 'desc'])
        .default('asc'),
});

// Schema for role existence check
export const roleExistsSchema = z.object({
    name: z
        .string()
        .min(1, 'Role name is required')
        .max(50, 'Role name cannot exceed 50 characters'),
});


// Schema for role assignment (when linking roles to users)
export const roleAssignmentSchema = z.object({
    userId: z.string('Invalid user UUID format'),
    roleId: z.string('Invalid role UUID format'),
});

// Predefined permission categories schema
export const permissionCategorySchema = z.object({
    category: z.string(),
    permissions: z.array(z.string()),
    description: z.string().optional(),
});

// Schema for permission builder/selector
export const permissionBuilderSchema = z.object({
    selectedPermissions: z
        .array(z.string())
        .default([])
        .refine(
            (permissions) => {
                // Ensure no duplicate permissions
                return new Set(permissions).size === permissions.length;
            },
            {
                message: 'Duplicate permissions are not allowed',
            }
        ),
    categories: z.array(permissionCategorySchema).optional(),
});

// Common predefined roles schema (for dropdowns/selects)
export const predefinedRolesSchema = z.array(
    z.object({
        name: z.string(),
        description: z.string(),
        isSystem: z.boolean().default(false),
    })
);

// Schema for role validation in forms
export const roleFormValidationSchema = z.object({
    name: z
        .string()
        .min(1, 'Role name is required')
        .max(50, 'Role name cannot exceed 50 characters')
        .regex(
            /^[A-Z_]+$/,
            'Role name must contain only uppercase letters and underscores (e.g., ADMIN, MANAGER, HR_STAFF)'
        )
        .refine(
            (name) => !['ROLE', 'USER', 'SYSTEM', 'ROOT'].includes(name),
            {
                message: 'Reserved role names are not allowed',
            }
        ),
    description: z
        .string()
        .min(3, 'Description must be at least 3 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional()
        .or(z.literal('')),
    permissions: z
        .array(z.string())
        .default([])
        .refine(
            (permissions) => permissions.length > 0,
            {
                message: 'At least one permission must be selected',
            }
        ),
});

// Type inference from schemas
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserRoleSearchParams = z.infer<typeof userRoleSearchSchema>;
export type RoleExistsData = z.infer<typeof roleExistsSchema>;
export type RoleAssignment = z.infer<typeof roleAssignmentSchema>;
export type PermissionCategory = z.infer<typeof permissionCategorySchema>;
export type PermissionBuilder = z.infer<typeof permissionBuilderSchema>;
export type PredefinedRoles = z.infer<typeof predefinedRolesSchema>;
export type RoleFormValidation = z.infer<typeof roleFormValidationSchema>;

// Validation helper functions
export const validateRoleName = (name: string): boolean => {
    return /^[A-Z_]+$/.test(name) && name.length <= 50 && name.length > 0;
};

export const validatePermissionsJson = (permissions: string): boolean => {
    if (!permissions || permissions.trim() === '') return true;
    try {
        const parsed = JSON.parse(permissions);
        return Array.isArray(parsed);
    } catch {
        return false;
    }
};

export const parsePermissions = (permissions: string | null): string[] => {
    if (!permissions || permissions.trim() === '') return [];
    try {
        const parsed = JSON.parse(permissions);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const stringifyPermissions = (permissions: string[]): string => {
    return JSON.stringify(permissions);
};

// Common validation messages
export const VALIDATION_MESSAGES = {
    ROLE_NAME_REQUIRED: 'Role name is required',
    ROLE_NAME_FORMAT: 'Role name must contain only uppercase letters and underscores',
    ROLE_NAME_MAX_LENGTH: 'Role name cannot exceed 50 characters',
    DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 1000 characters',
    PERMISSIONS_INVALID_JSON: 'Permissions must be a valid JSON array',
    PERMISSIONS_REQUIRED: 'At least one permission must be selected',
    RESERVED_ROLE_NAME: 'Reserved role names are not allowed',
    UUID_INVALID: 'Invalid UUID format',
} as const;