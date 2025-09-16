package org.pertitrack.backend.entity.personnel;

import org.junit.jupiter.api.*;
import org.pertitrack.backend.entity.auth.*;
import org.springframework.test.context.*;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class EmployeeTest {

    private Employee employee;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@test.com", "password", "John", "Doe");
        employee = new Employee();
    }

    @Test
    void constructor_shouldInitializeAllFields() {
        // Act
        Employee newEmployee = new Employee("Jane", "Smith", "EMP001", testUser);

        // Assert
        assertEquals("Jane", newEmployee.getFirstName());
        assertEquals("Smith", newEmployee.getLastName());
        assertEquals("EMP001", newEmployee.getEmployeeNumber());
        assertEquals(testUser, newEmployee.getUser());
        assertTrue(newEmployee.getIsActive());
    }

    @Test
    void setFullName_shouldSplitTwoNames() {
        // Act
        employee.setFullName("John Doe");

        // Assert
        assertEquals("John", employee.getFirstName());
        assertEquals("Doe", employee.getLastName());
    }

    @Test
    void setFullName_shouldHandleSingleName() {
        // Act
        employee.setFullName("John");

        // Assert
        assertEquals("John", employee.getFirstName());
        assertEquals("", employee.getLastName());
    }

    @Test
    void setFullName_shouldHandleThreeNames() {
        // Act
        employee.setFullName("John Peter Smith");

        // Assert
        assertEquals("John Peter", employee.getFirstName());
        assertEquals("Smith", employee.getLastName());
    }

    @Test
    void setFullName_shouldHandleFourNames() {
        // Act
        employee.setFullName("John Peter Michael Smith");

        // Assert
        assertEquals("John Peter", employee.getFirstName());
        assertEquals("Michael", employee.getLastName());
    }

    @Test
    void setFullName_shouldHandleEmptyString() {
        // Act
        employee.setFullName("");

        // Assert
        assertEquals("", employee.getFirstName());
        assertEquals("", employee.getLastName());
    }

}