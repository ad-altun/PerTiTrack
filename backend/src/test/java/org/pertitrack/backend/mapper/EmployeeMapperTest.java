package org.pertitrack.backend.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.Employee;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class EmployeeMapperTest {

    @InjectMocks
    private EmployeeMapper employeeMapper;

    private Employee testEmployee;
    private EmployeeDto testEmployeeDto;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
//        testUser.setId("550e8400-e29b-41d4-a716-446655440000");
        testUser.setEmail("john.doe@test.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        // Setup test employee entity with user
        testEmployee = new Employee();
//        testEmployee.setId("emp-123");
        testEmployee.setEmployeeNumber("EMP001");
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setIsActive(true);
        testEmployee.setUser(testUser);

        // Setup test employee DTO
        testEmployeeDto = new EmployeeDto(
                "emp-123",
                "EMP001",
                "John",
                "Doe",
                "John Doe",
                true,
                "550e8400-e29b-41d4-a716-446655440000",
                "john.doe@test.com",
                "John Doe"
        );
    }

    // toDto Tests
    // =================

    @Test
    void toDto_MapsEmployeeWithUserToDto_Successfully() {
        // Act
        EmployeeDto result = employeeMapper.toDto(testEmployee);

        // Assert
        assertNotNull(result);
        assertEquals(testEmployee.getId(), result.id());
        assertEquals(testEmployee.getEmployeeNumber(), result.employeeNumber());
        assertEquals(testEmployee.getFirstName(), result.firstName());
        assertEquals(testEmployee.getLastName(), result.lastName());
        assertEquals(testEmployee.getFullName(), result.fullName());
        assertEquals(testEmployee.getIsActive(), result.isActive());
        assertEquals(testEmployee.getUser().getId(), result.userId());
        assertEquals(testEmployee.getUser().getEmail(), result.userEmail());
        assertEquals(testEmployee.getUser().getFullName(), result.userFullName());
    }

    @Test
    void toDto_MapsEmployeeWithoutUserToDto_Successfully() {
        // Arrange
        testEmployee.setUser(null);

        // Act
        EmployeeDto result = employeeMapper.toDto(testEmployee);

        // Assert
        assertNotNull(result);
        assertEquals(testEmployee.getId(), result.id());
        assertEquals(testEmployee.getEmployeeNumber(), result.employeeNumber());
        assertEquals(testEmployee.getFirstName(), result.firstName());
        assertEquals(testEmployee.getLastName(), result.lastName());
        assertEquals(testEmployee.getFullName(), result.fullName());
        assertEquals(testEmployee.getIsActive(), result.isActive());
        assertNull(result.userId());
        assertNull(result.userEmail());
        assertNull(result.userFullName());
    }

    @Test
    void toDto_ReturnsNull_WhenEmployeeIsNull() {
        // Act
        EmployeeDto result = employeeMapper.toDto(null);

        // Assert
        assertNull(result);
    }

    // toEntity Tests
    // =================

    @Test
    void toEntity_MapsDtoToEmployee_Successfully() {
        // Act
        Employee result = employeeMapper.toEntity(testEmployeeDto);

        // Assert
        assertNotNull(result);
//        assertEquals(testEmployeeDto.id(), result.getId());
        assertEquals(testEmployeeDto.employeeNumber(), result.getEmployeeNumber());
        assertEquals(testEmployeeDto.firstName(), result.getFirstName());
        assertEquals(testEmployeeDto.lastName(), result.getLastName());
        assertEquals(testEmployeeDto.isActive(), result.getIsActive());

        // Note: User is not mapped in toEntity method
        assertNull(result.getUser());
    }

    @Test
    void toEntity_ReturnsNull_WhenDtoIsNull() {
        // Act
        Employee result = employeeMapper.toEntity(null);

        // Assert
        assertNull(result);
    }

    @Test
    void toEntity_MapsDtoWithInactiveStatus() {
        // Arrange
        EmployeeDto inactiveEmployeeDto = new EmployeeDto(
                "emp-inactive",
                "EMP002",
                "Jane",
                "Smith",
                "Jane Smith",
                false, // inactive
                "user-id-2",
                "jane@test.com",
                "Jane Smith"
        );

        // Act
        Employee result = employeeMapper.toEntity(inactiveEmployeeDto);

        // Assert
        assertNotNull(result);
        assertFalse(result.getIsActive());
        assertEquals(false, inactiveEmployeeDto.isActive());
    }

}