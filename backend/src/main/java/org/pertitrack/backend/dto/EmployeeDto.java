package org.pertitrack.backend.dto;

public record EmployeeDto(
        String id,
        String employeeNumber,
        String firstName,
        String lastName,
        String fullName,
        Boolean isActive,
        String userId,
        String userEmail,
        String userFullName
) {}
