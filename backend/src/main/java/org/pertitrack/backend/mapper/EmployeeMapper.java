package org.pertitrack.backend.mapper;

import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.entity.personnel.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeDto toDto(Employee employee) {
        if (employee == null) return null;

        return new EmployeeDto(
                employee.getId(),
                employee.getEmployeeNumber(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getFullName(),
                employee.getIsActive(),
                employee.getUser() != null ? employee.getUser().getId() : null,
                employee.getUser() != null ? employee.getUser().getEmail() : null,
                employee.getUser() != null ? employee.getUser().getFullName() : null
        );
    }

    public Employee toEntity(EmployeeDto dto) {
        if (dto == null) return null;

        Employee employee = new Employee();
        employee.setId(dto.id());
        employee.setEmployeeNumber(dto.employeeNumber());
        employee.setFirstName(dto.firstName());
        employee.setLastName(dto.lastName());
        employee.setIsActive(dto.isActive());
        return employee;
    }
}
