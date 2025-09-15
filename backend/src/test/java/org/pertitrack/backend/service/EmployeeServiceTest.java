package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.CreateEmployeeRequest;
import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.dto.UpdateEmployeeRequest;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.exceptions.EmployeeAlreadyExistException;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.mapper.EmployeeMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeMapper employeeMapper;

    @Mock
    private IdService idService;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;
    private EmployeeDto testEmployeeDto;
    private CreateEmployeeRequest createEmployeeRequest;
    private UpdateEmployeeRequest updateEmployeeRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId("550e8400-e29b-41d4-a716-446655440000");
        testUser.setEmail("john.doe@test.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        // Setup test employee entity
        testEmployee = new Employee();
        testEmployee.setId("emp-123");
        testEmployee.setEmployeeNumber("EMP001");
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setFullName("John Doe");
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
    void getAllEmployees_ReturnsListOfEmployeeDtos() {
        // Arrange
        List<Employee> employees = Arrays.asList(testEmployee);
        when(employeeRepository.findAll()).thenReturn(employees);
        when(employeeMapper.toDto(testEmployee)).thenReturn(testEmployeeDto);

        // Act
        List<EmployeeDto> result = employeeService.getAllEmployees();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testEmployeeDto, result.getFirst());

        verify(employeeRepository).findAll();
        verify(employeeMapper).toDto(testEmployee);
    }

    @Test
    void getAllEmployees_ReturnsEmptyList_WhenNoEmployeesExist() {
        // Arrange
        when(employeeRepository.findAll()).thenReturn(List.of());

        // Act
        List<EmployeeDto> result = employeeService.getAllEmployees();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(employeeRepository).findAll();
        verify(employeeMapper, never()).toDto(any(Employee.class));
    }

    // getEmployeeById Tests

    @Test
    void getEmployeeById_ReturnsEmployeeDto_WhenEmployeeExists() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        when(employeeMapper.toDto(testEmployee)).thenReturn(testEmployeeDto);

        // Act
        EmployeeDto result = employeeService.getEmployeeById(employeeId);

        // Assert
        assertNotNull(result);
        assertEquals(testEmployeeDto, result);

        verify(employeeRepository).findById(employeeId);
        verify(employeeMapper).toDto(testEmployee);
    }

    @Test
    void getEmployeeById_ThrowsEmployeeNotFoundException_WhenEmployeeNotFound() {
        // Arrange
        String employeeId = "non-existent-id";
        when(employeeRepository.findById(employeeId)).thenThrow(new EmployeeNotFoundException("Employee not found: ", employeeId));

        // Act & Assert
        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.getEmployeeById(employeeId)
        );

        assertEquals("Employee not found: " + employeeId, exception.getMessage());
        assertEquals(employeeId, exception.getId());
        verify(employeeRepository).findById(employeeId);
        verify(employeeMapper, never()).toDto(any(Employee.class));
    }

    // =================
    // createEmployee Tests
    // =================

    @Test
    void createEmployee_CreatesEmployeeWithoutUser_WhenUserIdNotProvided() {
        // Arrange
        String generatedId = "550e8400-e29b-41d4-a716-446655440002";
        String employeeNumber = "0001";

        createEmployeeRequest.setUserId(null);
        createEmployeeRequest.setEmployeeNumber(employeeNumber);
        createEmployeeRequest.setFirstName("John");
        createEmployeeRequest.setLastName("Doe");


        // Create test employee without user
        Employee savedEmployee = new Employee();
        savedEmployee.setId(generatedId);
        savedEmployee.setEmployeeNumber(employeeNumber);
        savedEmployee.setFirstName("John");
        savedEmployee.setLastName("Doe");
        savedEmployee.setIsActive(true);
        savedEmployee.setUser(null); // No user linked

        when(employeeRepository.findEmployeeByEmployeeNumber(employeeNumber))
                .thenReturn(Optional.empty());
        when(idService.generateId()).thenReturn(generatedId);
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(savedEmployee);

        // Act
        EmployeeDto result = employeeService.createEmployee(createEmployeeRequest);

        // Assert
        assertNotNull(result);
        assertEquals(generatedId, result.id());
        assertEquals(employeeNumber, result.employeeNumber());
        assertEquals("John", result.firstName());
        assertEquals("Doe", result.lastName());
        assertEquals("John Doe", result.fullName());
        assertTrue(result.isActive());
        assertNull(result.userId());
        assertNull(result.userEmail());
        assertNull(result.userFullName());

        verify(employeeRepository).findEmployeeByEmployeeNumber(employeeNumber);
        verify(idService).generateId();
        verify(employeeRepository).save(argThat(emp ->
                emp.getEmployeeNumber().equals(employeeNumber) &&
                        emp.getFirstName().equals("John") &&
                        emp.getLastName().equals("Doe") &&
                        emp.getUser() == null &&
                        emp.getIsActive().equals(true)
        ));
        verify(userRepository, never()).findById(any());
    }

    @Test
    void createEmployee_CreatesEmployeeWithUser_WhenUserIdProvided() {
        // Arrange
        String generatedId = "550e8400-e29b-41d4-a716-446655440002";
        String employeeNumber = "0001";

        createEmployeeRequest.setUserId(null);
        createEmployeeRequest.setEmployeeNumber(employeeNumber);
        createEmployeeRequest.setFirstName("John");
        createEmployeeRequest.setLastName("Doe");


        // Create test employee without user
        Employee savedEmployee = new Employee();
        savedEmployee.setId(generatedId);
        savedEmployee.setEmployeeNumber(employeeNumber);
        savedEmployee.setFirstName("John");
        savedEmployee.setLastName("Doe");
        savedEmployee.setIsActive(true);
        savedEmployee.setUser(null); // No user linked

        when(employeeRepository.findEmployeeByEmployeeNumber(employeeNumber))
                .thenReturn(Optional.empty());
        when(idService.generateId()).thenReturn(null);
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(savedEmployee);

        // Act
        EmployeeDto result = employeeService.createEmployee(createEmployeeRequest);

        // Assert
        assertNotNull(result);
        assertEquals(generatedId, result.id());
        assertEquals(employeeNumber, result.employeeNumber());
        assertEquals("John", result.firstName());
        assertEquals("Doe", result.lastName());
        assertEquals("John Doe", result.fullName());
        assertTrue(result.isActive());
        assertNull(result.userId());
        assertNull(result.userEmail());
        assertNull(result.userFullName());

        verify(employeeRepository).findEmployeeByEmployeeNumber(employeeNumber);
        verify(idService).generateId();
        verify(employeeRepository).save(argThat(emp ->
                emp.getEmployeeNumber().equals(employeeNumber) &&
                        emp.getFirstName().equals("John") &&
                        emp.getLastName().equals("Doe") &&
                        emp.getUser() == null &&
                        emp.getIsActive().equals(true)
        ));
        verify(userRepository, never()).findById(any());
    }

    @Test
    void createEmployee_ThrowsEmployeeAlreadyExistException_WhenEmployeeNumberExists() {
        // Arrange
        when(employeeRepository.findEmployeeByEmployeeNumber("EMP002"))
                .thenReturn(Optional.of(testEmployee));

        // Act & Assert
        EmployeeAlreadyExistException exception = assertThrows(
                EmployeeAlreadyExistException.class,
                () -> employeeService.createEmployee(createEmployeeRequest)
        );

        assertTrue(exception.getMessage().contains("Employee already exists: "));
        assertTrue(exception.getMessage().contains("EMP002"));

        verify(employeeRepository).findEmployeeByEmployeeNumber("EMP002");
        verify(idService, never()).generateId();
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void createEmployee_ThrowsUsernameNotFoundException_WhenUserNotFound() {
        // Arrange
        String userId = createEmployeeRequest.getUserId();

        when(employeeRepository.findEmployeeByEmployeeNumber("EMP002")).thenReturn(Optional.empty());
        when(idService.generateId()).thenReturn("emp-new-123");
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> employeeService.createEmployee(createEmployeeRequest)
        );

        assertTrue(exception.getMessage().contains("User not found with ID"));
        assertTrue(exception.getMessage().contains(userId));

        verify(employeeRepository).findEmployeeByEmployeeNumber("EMP002");
        verify(idService).generateId();
        verify(userRepository).findById(userId);
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    // updateEmployee Tests

    @Test
    void updateEmployee_UpdatesEmployee_WhenEmployeeExists() {
        // Arrange
        String employeeId = "emp-123";
        Employee updatedEmployee = new Employee();
        updatedEmployee.setId(employeeId);
        updatedEmployee.setEmployeeNumber("EMP001-UPDATED");
        updatedEmployee.setFirstName("John Updated");
        updatedEmployee.setLastName("Doe Updated");
        updatedEmployee.setIsActive(false);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(updatedEmployee);
        when(employeeMapper.toDto(updatedEmployee)).thenReturn(testEmployeeDto);

        // Act
        EmployeeDto result = employeeService.updateEmployee(employeeId, updateEmployeeRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testEmployeeDto, result);

        verify(employeeRepository).findById(employeeId);
        verify(employeeRepository).save(any(Employee.class));
        verify(employeeMapper).toDto(updatedEmployee);
    }

    @Test
    void updateEmployee_ThrowsEmployeeNotFoundException_WhenEmployeeNotFound() {
        // Arrange
        String employeeId = "non-existent-id";
        when(employeeRepository.findById(employeeId)).thenThrow(new EmployeeNotFoundException("Employee not found: ", employeeId));

        // Act & Assert
        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> employeeService.updateEmployee(employeeId, updateEmployeeRequest)
        );

        assertEquals("Employee not found: " + employeeId, exception.getMessage());

        verify(employeeRepository).findById(employeeId);
        verify(employeeRepository, never()).save(any(Employee.class));
        verify(employeeMapper, never()).toDto(any(Employee.class));
    }

    // deleteEmployee Tests

    @Test
    void deleteEmployee_ReturnsTrue_WhenEmployeeExists() {
        // Arrange
        String employeeId = "emp-123";
        when(employeeRepository.existsById(employeeId)).thenReturn(true);

        // Act
        boolean result = employeeService.deleteEmployee(employeeId);

        // Assert
        assertTrue(result);

        verify(employeeRepository).existsById(employeeId);
        verify(employeeRepository).deleteById(employeeId);
    }

    @Test
    void deleteEmployee_ReturnsFalse_WhenEmployeeNotFound() {
        // Arrange
        String employeeId = "non-existent-id";
        when(employeeRepository.existsById(employeeId)).thenReturn(false);

        // Act
        boolean result = employeeService.deleteEmployee(employeeId);

        // Assert
        assertFalse(result);

        verify(employeeRepository).existsById(employeeId);
        verify(employeeRepository, never()).deleteById(anyString());
    }

}