package org.pertitrack.backend.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class TimeRecordNotFoundExceptionTest {

    @Test
    void constructor_createsExceptionWithCorrectMessage() {
        // Arrange
        String message = "TimeRecord not found with id: ";
        String id = "550e8400-e29b-41d4-a716-446655440000";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        String expectedMessage = "TimeRecord not found with id: 550e8400-e29b-41d4-a716-446655440000";
        assertEquals(expectedMessage, exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_concatenatesMessageAndId() {
        // Arrange
        String message = "Could not find time record: ";
        String id = "abc-123";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        assertEquals("Could not find time record: abc-123", exception.getMessage());
    }

    @Test
    void getId_returnsCorrectId() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id = "test-id-123";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesEmptyMessage() {
        // Arrange
        String message = "";
        String id = "550e8400-e29b-41d4-a716-446655440000";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        assertEquals(id, exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesEmptyId() {
        // Arrange
        String message = "TimeRecord not found with id: ";
        String id = "";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

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
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        assertEquals("", exception.getMessage());
        assertEquals("", exception.getId());
    }

    @Test
    void exception_isRuntimeException() {
        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(
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
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(null, id);

        // Assert
        assertEquals("nulltest-id", exception.getMessage());
        assertEquals(id, exception.getId());
    }

    @Test
    void constructor_handlesNullId() {
        // Arrange
        String message = "TimeRecord not found: ";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, null);

        // Assert
        assertEquals("TimeRecord not found: null", exception.getMessage());
        assertNull(exception.getId());
    }

    @Test
    void constructor_handlesBothNullValues() {
        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(null, null);

        // Assert
        assertEquals("nullnull", exception.getMessage());
        assertNull(exception.getId());
    }

    @Test
    void exception_canBeThrown() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id = "test-id";

        // Act & Assert
        assertThrows(TimeRecordNotFoundException.class, () -> {
            throw new TimeRecordNotFoundException(message, id);
        });
    }

    @Test
    void exception_canBeCaught() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id = "test-id";

        // Act
        try {
            throw new TimeRecordNotFoundException(message, id);
        } catch (TimeRecordNotFoundException e) {
            // Assert
            assertEquals("TimeRecord not found: test-id", e.getMessage());
            assertEquals(id, e.getId());
        }
    }

    @Test
    void constructor_withUuidFormat_handlesCorrectly() {
        // Arrange
        String message = "TimeRecord not found with id: ";
        String uuidId = "550e8400-e29b-41d4-a716-446655440000";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, uuidId);

        // Assert
        assertEquals(uuidId, exception.getId());
        assertTrue(exception.getMessage().contains(uuidId));
    }

    @Test
    void constructor_withDifferentIds_storesEachCorrectly() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id1 = "id-001";
        String id2 = "id-002";

        // Act
        TimeRecordNotFoundException exception1 = new TimeRecordNotFoundException(message, id1);
        TimeRecordNotFoundException exception2 = new TimeRecordNotFoundException(message, id2);

        // Assert
        assertEquals(id1, exception1.getId());
        assertEquals(id2, exception2.getId());
        assertNotEquals(exception1.getId(), exception2.getId());
    }

    @Test
    void getId_isConsistentAcrossMultipleCalls() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id = "consistent-id";
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Act & Assert
        assertEquals(id, exception.getId());
        assertEquals(id, exception.getId());
        assertEquals(id, exception.getId());
    }

    @Test
    void exception_hasCorrectStackTrace() {
        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(
                "Test message", "test-id"
        );

        // Assert
        assertNotNull(exception.getStackTrace());
        assertTrue(exception.getStackTrace().length > 0);
        assertEquals(this.getClass().getName(), exception.getStackTrace()[0].getClassName());
    }

    @Test
    void constructor_withSpecialCharactersInId_handlesCorrectly() {
        // Arrange
        String message = "TimeRecord not found: ";
        String id = "id-@#$%^&*()";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, id);

        // Assert
        assertEquals(id, exception.getId());
        assertTrue(exception.getMessage().contains(id));
    }

    @Test
    void constructor_withLongId_handlesCorrectly() {
        // Arrange
        String message = "TimeRecord not found: ";
        String longId = "a".repeat(500);

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, longId);

        // Assert
        assertEquals(longId, exception.getId());
        assertEquals(500, exception.getId().length());
    }

    @Test
    void exception_withNumericId_handlesCorrectly() {
        // Arrange
        String message = "TimeRecord not found with id: ";
        String numericId = "12345";

        // Act
        TimeRecordNotFoundException exception = new TimeRecordNotFoundException(message, numericId);

        // Assert
        assertEquals(numericId, exception.getId());
        assertTrue(exception.getMessage().contains(numericId));
    }

}