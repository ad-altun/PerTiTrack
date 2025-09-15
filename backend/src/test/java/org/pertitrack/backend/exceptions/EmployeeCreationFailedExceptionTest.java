package org.pertitrack.backend.exceptions;

import org.junit.jupiter.api.*;
import org.springframework.test.context.*;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class EmployeeCreationFailedExceptionTest {

    @Test
    void constructor_CreatesExceptionWithCorrectMessage() {
        // Arrange
        String message = "Failed to create employee for user ";
        String email = "test@example.com";
        String exceptionMessage = "Database connection failed";

        // Act
        EmployeeCreationFailedException exception = new EmployeeCreationFailedException(
                message, email, exceptionMessage
        );

        // Assert
        String expectedMessage = "Failed to create employee for user test@example.com: Database connection failed";
        assertEquals(expectedMessage, exception.getMessage());
        assertEquals(email, exception.getEmail());
        assertEquals(message, exception.getExceptionMessage());
    }

    @Test
    void constructor_HandlesEmptyStrings() {
        // Arrange
        String message = "";
        String email = "";
        String exceptionMessage = "";

        // Act
        EmployeeCreationFailedException exception = new EmployeeCreationFailedException(
                message, email, exceptionMessage
        );

        // Assert
        String expectedMessage = ": ";
        assertEquals(expectedMessage, exception.getMessage());
        assertEquals("", exception.getEmail());
        assertEquals("", exception.getExceptionMessage());
    }

    @Test
    void exception_IsRuntimeException() {
        // Arrange & Act
        EmployeeCreationFailedException exception = new EmployeeCreationFailedException(
                "Test message", "test@example.com", "Test cause"
        );

        // Assert
        assertInstanceOf(RuntimeException.class, exception);
    }

}