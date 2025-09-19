// Create: src/hooks/useCurrentEmployee.ts
import { useAppSelector } from "../store/hook";
import { selectCurrentUser, selectUserRoles } from "../store/slices/authSlice";
import { useGetEmployeeByIdQuery } from "../store/api/employeeApi.ts";

export const useCurrentEmployee = () => {
    // Get current user from auth
    const currentUser = useAppSelector(selectCurrentUser);
    const userRoles = useAppSelector(selectUserRoles);

    // Check user roles
    const isEmployee = userRoles.includes('ROLE_EMPLOYEE');
    const isManager = userRoles.includes('ROLE_MANAGER');
    const isAdmin = userRoles.includes('ROLE_ADMIN');

    // Determine display names
    const getDisplayName = (): string => {
        if (currentUser?.fullName) return currentUser.fullName;
        if (currentUser?.firstName && currentUser.lastName) {
            return `${currentUser.firstName} ${currentUser.lastName}`;
        }
        return 'Unknown User';
    };

    // Permission helpers for future features
    const canManageTimeRecords = isEmployee || isManager || isAdmin;
    const canViewAllEmployees = isManager || isAdmin;
    const canApproveAbsences = isManager || isAdmin;

    return {
        // Employee-specific data
        employee: null,
        employeeId: currentUser?.employeeId || null,
        employeeNumber: currentUser?.employeeNumber || null,

        // Display names (works for all user types)
        displayName: getDisplayName(),

        // User context
        isEmployee,
        isManager,
        isAdmin,
        userRoles,

        // Loading states
        isLoading: false,
        error: null,

        // Permissions
        canClockIn: isEmployee,

        // For debugging
        userType: isEmployee ? 'Employee' : isAdmin ? 'Admin' : isManager ? 'Manager' : 'User',

        // Permissions for future features
        canManageTimeRecords,
        canViewAllEmployees,
        canApproveAbsences,
    };
};