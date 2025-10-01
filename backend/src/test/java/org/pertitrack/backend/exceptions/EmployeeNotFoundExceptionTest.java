package org.pertitrack.backend.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class EmployeeNotFoundExceptionTest {
    @Test
    void constructor_createsExceptionWithCorrectMessage() {
        // Arrange
        String message = "Employee not found with id: ";
        String id = "550e8400-e29b-41d4-a716-446655440000";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        String expectedMessage = "Employee not found with id: 550e8400-e29b-41d4-a716-446655440000";
        assertEquals(expectedMessage, exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_concatenatesMessageAndId() {
        // Arrange
        String message = "Could not find employee: ";
        String id = "emp-123";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        assertEquals("Could not find employee: emp-123", exception.getMessage());
    }

    @Test
    void getId_returnsCorrectId() {
        // Arrange
        String message = "Employee not found: ";
        String id = "employee-id-456";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesEmptyMessage() {
        // Arrange
        String message = "";
        String id = "550e8400-e29b-41d4-a716-446655440000";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        assertEquals(id, exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesEmptyId() {
        // Arrange
        String message = "Employee not found with id: ";
        String id = "";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        assertEquals(message, exception.getMessage());
        assertEquals("", exception.getId());
    }

    @Test
    void constructor_handlesBothEmptyStrings() {
        // Arrange
        String message = "";
        String id = "";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Assert
        assertEquals("", exception.getMessage());
        assertEquals("", exception.getId());
    }

    @Test
    void exception_isRuntimeException() {
        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(
                "Test message", "test-id"
        );

        // Assert
        assertInstanceOf(RuntimeException.class, exception);
    }

    @Test
    void constructor_handlesNullMessage() {
        // Arrange
        String id = "test-id";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(null, id);

        // Assert
        assertEquals("nulltest-id", exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesNullId() {
        // Arrange
        String message = "Employee not found: ";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, null);

        // Assert
        assertEquals("Employee not found: null", exception.getMessage());
        assertNull(exception.getId());
    }

    @Test
    void constructor_handlesBothNullValues() {
        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(null, null);

        // Assert
        assertEquals("nullnull", exception.getMessage());
        assertNull(exception.getId());
    }

    @Test
    void exception_canBeThrown() {
        // Arrange
        String message = "Employee not found: ";
        String id = "test-id";

        // Act & Assert
        assertThrows(EmployeeNotFoundException.class, () -> {
            throw new EmployeeNotFoundException(message, id);
        });
    }

    @Test
    void exception_canBeCaught() {
        // Arrange
        String message = "Employee not found: ";
        String id = "emp-789";

        // Act
        try {
            throw new EmployeeNotFoundException(message, id);
        } catch (EmployeeNotFoundException e) {
            // Assert
            assertEquals("Employee not found: emp-789", e.getMessage());
            assertEquals(id, e.getId());
        }
    }

    @Test
    void constructor_withUuidFormat_handlesCorrectly() {
        // Arrange
        String message = "Employee not found with id: ";
        String uuidId = "660e8400-e29b-41d4-a716-446655440001";

        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, uuidId);

        // Assert
        assertEquals(uuidId, exception.getId());
        assertTrue(exception.getMessage().contains(uuidId));
    }

    @Test
    void constructor_withDifferentIds_storesEachCorrectly() {
        // Arrange
        String message = "Employee not found: ";
        String id1 = "emp-001";
        String id2 = "emp-002";

        // Act
        EmployeeNotFoundException exception1 = new EmployeeNotFoundException(message, id1);
        EmployeeNotFoundException exception2 = new EmployeeNotFoundException(message, id2);

        // Assert
        assertEquals(id1, exception1.getId());
        assertEquals(id2, exception2.getId());
        assertNotEquals(exception1.getId(), exception2.getId());
    }

    @Test
    void getId_isConsistentAcrossMultipleCalls() {
        // Arrange
        String message = "Employee not found: ";
        String id = "consistent-emp-id";
        EmployeeNotFoundException exception = new EmployeeNotFoundException(message, id);

        // Act & Assert
        assertEquals(id, exception.getId());
        assertEquals(id, exception.getId());
        assertEquals(id, exception.getId());
    }

    @Test
    void exception_hasCorrectStackTrace() {
        // Act
        EmployeeNotFoundException exception = new EmployeeNotFoundException(
                "Test message", "test-id"
        );

        // Assert
        assertNotNull(exception.getStackTrace());
        assertTrue(exception.getStackTrace().length > 0);
        assertEquals(this.getClass().getName(), exception.getStackTrace()[0].getClassName());
    }

}