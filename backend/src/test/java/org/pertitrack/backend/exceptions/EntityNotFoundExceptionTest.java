package org.pertitrack.backend.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class EntityNotFoundExceptionTest {

    @Test
    void constructor_withMessage_createsExceptionWithCorrectMessage() {
        // Arrange
        String message = "Entity not found with id: 123";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message);

        // Assert
        assertEquals(message, exception.getMessage());
    }

    @Test
    void constructor_withMessageAndCause_createsExceptionWithBoth() {
        // Arrange
        String message = "Entity not found";
        Throwable cause = new RuntimeException("Database connection failed");

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message, cause);

        // Assert
        assertEquals(message, exception.getMessage());
        assertEquals(cause, exception.getCause());
        assertEquals("Database connection failed", exception.getCause().getMessage());
    }

    @Test
    void exception_isRuntimeException() {
        // Act
        EntityNotFoundException exception = new EntityNotFoundException("Test message");

        // Assert
        assertInstanceOf(RuntimeException.class, exception);
    }

    @Test
    void constructor_withNullMessage_createsExceptionWithNullMessage() {
        // Act
        EntityNotFoundException exception = new EntityNotFoundException(null);

        // Assert
        assertNull(exception.getMessage());
    }

    @Test
    void constructor_withEmptyMessage_createsExceptionWithEmptyMessage() {
        // Arrange
        String message = "";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message);

        // Assert
        assertEquals("", exception.getMessage());
    }

    @Test
    void constructor_withNullCause_createsExceptionWithNullCause() {
        // Arrange
        String message = "Test message";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message, null);

        // Assert
        assertEquals(message, exception.getMessage());
        assertNull(exception.getCause());
    }

    @Test
    void constructor_withDifferentMessages_storesEachCorrectly() {
        // Arrange
        String message1 = "TimeRecord not found with id: 123";
        String message2 = "Employee not found with id: 456";

        // Act
        EntityNotFoundException exception1 = new EntityNotFoundException(message1);
        EntityNotFoundException exception2 = new EntityNotFoundException(message2);

        // Assert
        assertEquals(message1, exception1.getMessage());
        assertEquals(message2, exception2.getMessage());
        assertNotEquals(exception1.getMessage(), exception2.getMessage());
    }

    @Test
    void constructor_withCause_preservesCauseStackTrace() {
        // Arrange
        RuntimeException cause = new RuntimeException("Original error");
        String message = "Entity not found";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message, cause);

        // Assert
        assertNotNull(exception.getCause());
        assertEquals(cause, exception.getCause());
        assertNotNull(exception.getCause().getStackTrace());
        assertTrue(exception.getCause().getStackTrace().length > 0);
    }

    @Test
    void exception_canBeThrown() {
        // Arrange
        String message = "Test entity not found";

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            throw new EntityNotFoundException(message);
        });
    }

    @Test
    void exception_canBeCaught() {
        // Arrange
        String message = "Entity not found";

        // Act
        try {
            throw new EntityNotFoundException(message);
        } catch (EntityNotFoundException e) {
            // Assert
            assertEquals(message, e.getMessage());
        }
    }

    @Test
    void constructor_withComplexMessage_storesMessageCorrectly() {
        // Arrange
        String entityType = "TimeRecord";
        String entityId = "550e8400-e29b-41d4-a716-446655440000";
        String message = String.format("%s not found with id: %s", entityType, entityId);

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message);

        // Assert
        assertTrue(exception.getMessage().contains(entityType));
        assertTrue(exception.getMessage().contains(entityId));
    }

    @Test
    void constructor_withNestedCause_preservesFullCauseChain() {
        // Arrange
        Throwable rootCause = new IllegalArgumentException("Invalid argument");
        Throwable intermediateCause = new RuntimeException("Intermediate error", rootCause);
        String message = "Entity not found";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message, intermediateCause);

        // Assert
        assertEquals(intermediateCause, exception.getCause());
        assertEquals(rootCause, exception.getCause().getCause());
    }

    @Test
    void exception_hasCorrectStackTrace() {
        // Act
        EntityNotFoundException exception = new EntityNotFoundException("Test");

        // Assert
        assertNotNull(exception.getStackTrace());
        assertTrue(exception.getStackTrace().length > 0);
        assertEquals(this.getClass().getName(), exception.getStackTrace()[0].getClassName());
    }

    @Test
    void exception_withLongMessage_storesFullMessage() {
        // Arrange
        String longMessage = "A".repeat(1000);

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(longMessage);

        // Assert
        assertEquals(1000, exception.getMessage().length());
        assertEquals(longMessage, exception.getMessage());
    }

    @Test
    void constructor_withSpecialCharactersInMessage_handlesCorrectly() {
        // Arrange
        String message = "Entity not found: @#$%^&*()_+-=[]{}|;':\",./<>?";

        // Act
        EntityNotFoundException exception = new EntityNotFoundException(message);

        // Assert
        assertEquals(message, exception.getMessage());
    }
}