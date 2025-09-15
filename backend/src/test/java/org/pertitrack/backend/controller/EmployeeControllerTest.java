package org.pertitrack.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.CreateEmployeeRequest;
import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.dto.UpdateEmployeeRequest;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private EmployeeDto testEmployeeDto;
    private CreateEmployeeRequest createEmployeeRequest;
    private UpdateEmployeeRequest updateEmployeeRequest;

    @BeforeEach
    void setUp() {
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

        // Setup create request
        createEmployeeRequest = new CreateEmployeeRequest();
        createEmployeeRequest.setEmployeeNumber("EMP002");
        createEmployeeRequest.setFirstName("Jane");
        createEmployeeRequest.setLastName("Smith");
        createEmployeeRequest.setUserId("550e8400-e29b-41d4-a716-446655440001");

        // Setup update request
        updateEmployeeRequest = new UpdateEmployeeRequest();
        updateEmployeeRequest.setFirstName("John Updated");
        updateEmployeeRequest.setLastName("Doe Updated");
        updateEmployeeRequest.setActive(false);
    }

    // getAllEmployees Tests

    @Test
    void getAllEmployees_ReturnsOkWithEmployeeList() {
        // Arrange
        List<EmployeeDto> employeeList = Arrays.asList(testEmployeeDto);
        when(employeeService.getAllEmployees()).thenReturn(employeeList);

        // Act
        ResponseEntity<List<EmployeeDto>> response = employeeController.getAllEmployees();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(testEmployeeDto, response.getBody().get(0));

        verify(employeeService).getAllEmployees();
    }

    @Test
    void getAllEmployees_PropagatesServiceException() {
        // Arrange
        when(employeeService.getAllEmployees()).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> employeeController.getAllEmployees()
        );

        assertEquals("Database error", exception.getMessage());
        verify(employeeService).getAllEmployees();
    }

    // getEmployeeById Tests

    @Test
    void getEmployeeById_ReturnsOkWithEmployee_WhenEmployeeExists() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeService.getEmployeeById(employeeId)).thenReturn(testEmployeeDto);

        // Act
        ResponseEntity<EmployeeDto> response = employeeController.getEmployeeById(employeeId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testEmployeeDto, response.getBody());

        verify(employeeService).getEmployeeById(employeeId);
    }

    @Test
    void getEmployeeById_PropagatesEmployeeNotFoundException() {
        // Arrange
        String employeeId = "non-existent-id";
        when(employeeService.getEmployeeById(employeeId))
                .thenThrow(new EmployeeNotFoundException("Employee not found: ", employeeId));

        // Act & Assert
        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeController.getEmployeeById(employeeId)
        );

        assertEquals("Employee not found: " + employeeId, exception.getMessage());
        assertEquals(employeeId, exception.getId());
        verify(employeeService).getEmployeeById(employeeId);
    }

    // createEmployee Tests

    @Test
    void createEmployee_ReturnsOkWithCreatedEmployee() {
        // Arrange
        when(employeeService.createEmployee(createEmployeeRequest)).thenReturn(testEmployeeDto);

        // Act
        ResponseEntity<EmployeeDto> response = employeeController.createEmployee(createEmployeeRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testEmployeeDto, response.getBody());

        verify(employeeService).createEmployee(createEmployeeRequest);
    }

    @Test
    void createEmployee_PropagatesUsernameNotFoundException_WhenUserNotFound() {
        // Arrange
        when(employeeService.createEmployee(createEmployeeRequest))
                .thenThrow(new UsernameNotFoundException("User not found with ID: " + createEmployeeRequest.getUserId()));

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> employeeController.createEmployee(createEmployeeRequest)
        );

        assertTrue(exception.getMessage().contains("User not found with ID"));
        verify(employeeService).createEmployee(createEmployeeRequest);
    }

    // updateEmployee Tests

    @Test
    void updateEmployee_ReturnsOkWithUpdatedEmployee() {
        // Arrange
        String employeeId = "emp-123";
        EmployeeDto updatedEmployeeDto = new EmployeeDto(
                employeeId,
                "EMP001-UPDATED",
                "John Updated",
                "Doe Updated",
                "John Updated Doe Updated",
                false,
                "550e8400-e29b-41d4-a716-446655440000",
                "john.doe@test.com",
                "John Updated Doe Updated"
        );

        when(employeeService.updateEmployee(employeeId, updateEmployeeRequest))
                .thenReturn(updatedEmployeeDto);

        // Act
        ResponseEntity<EmployeeDto> response = employeeController.updateEmployee(employeeId, updateEmployeeRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(updatedEmployeeDto, response.getBody());

        verify(employeeService).updateEmployee(employeeId, updateEmployeeRequest);
    }

    @Test
    void updateEmployee_PropagatesIllegalArgumentException_WhenEmployeeNumberExists() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeService.updateEmployee(employeeId, updateEmployeeRequest))
                .thenThrow(new IllegalArgumentException("Employee number already exists: EMP001-UPDATED"));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> employeeController.updateEmployee(employeeId, updateEmployeeRequest)
        );

        assertTrue(exception.getMessage().contains("Employee number already exists"));
        verify(employeeService).updateEmployee(employeeId, updateEmployeeRequest);
    }

    @Test
    void updateEmployee_HandlesNullRequest() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeService.updateEmployee(employeeId, null))
                .thenThrow(new NullPointerException("Request cannot be null"));

        // Act & Assert
        NullPointerException exception = assertThrows(
                NullPointerException.class,
                () -> employeeController.updateEmployee(employeeId, null)
        );

        assertEquals("Request cannot be null", exception.getMessage());
        verify(employeeService).updateEmployee(employeeId, null);
    }

    // deleteEmployee Tests

    @Test
    void deleteEmployee_ReturnsNoContent_WhenEmployeeDeletedSuccessfully() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeService.deleteEmployee(employeeId)).thenReturn(true);

        // Act
        ResponseEntity<Void> response = employeeController.deleteEmployee(employeeId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());

        verify(employeeService).deleteEmployee(employeeId);
    }

    @Test
    void deleteEmployee_ReturnsNotFound_WhenEmployeeNotFound() {
        // Arrange
        String employeeId = "non-existent-id";
        when(employeeService.deleteEmployee(employeeId)).thenReturn(false);

        // Act
        ResponseEntity<Void> response = employeeController.deleteEmployee(employeeId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        verify(employeeService).deleteEmployee(employeeId);
    }

    // Integration and Edge Case Tests

    @Test
    void getAllEmployees_WithMultipleEmployees() {
        // Arrange
        EmployeeDto employee1 = new EmployeeDto(
                "emp-1", "EMP001", "John", "Doe", "John Doe",
                true, "user-1", "john@test.com", "John Doe"
        );
        EmployeeDto employee2 = new EmployeeDto(
                "emp-2", "EMP002", "Jane", "Smith", "Jane Smith",
                true, "user-2", "jane@test.com", "Jane Smith"
        );

        List<EmployeeDto> employeeList = Arrays.asList(employee1, employee2);
        when(employeeService.getAllEmployees()).thenReturn(employeeList);

        // Act
        ResponseEntity<List<EmployeeDto>> response = employeeController.getAllEmployees();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().contains(employee1));
        assertTrue(response.getBody().contains(employee2));
    }

    @Test
    void createEmployee_WithMinimalRequest() {
        // Arrange
        CreateEmployeeRequest minimalRequest = new CreateEmployeeRequest();
        minimalRequest.setEmployeeNumber("MIN001");
        minimalRequest.setFirstName("Min");
        minimalRequest.setLastName("Employee");
        // No userId provided

        EmployeeDto createdEmployee = new EmployeeDto(
                "emp-min", "MIN001", "Min", "Employee", "Min Employee",
                true, null, null, null
        );

        when(employeeService.createEmployee(minimalRequest)).thenReturn(createdEmployee);

        // Act
        ResponseEntity<EmployeeDto> response = employeeController.createEmployee(minimalRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdEmployee, response.getBody());
        verify(employeeService).createEmployee(minimalRequest);
    }

    @Test
    void updateEmployee_WithPartialRequest() {
        // Arrange
        String employeeId = "emp-123";
        UpdateEmployeeRequest partialRequest = new UpdateEmployeeRequest();
        partialRequest.setFirstName("UpdatedName");
        // Other fields remain null

        when(employeeService.updateEmployee(employeeId, partialRequest)).thenReturn(testEmployeeDto);

        // Act
        ResponseEntity<EmployeeDto> response = employeeController.updateEmployee(employeeId, partialRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testEmployeeDto, response.getBody());
        verify(employeeService).updateEmployee(employeeId, partialRequest);
    }


}