package org.pertitrack.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class IdServiceTest {

    @InjectMocks
    private IdService idService;

    @Test
    void generateId_returnsNonNullString() {
        // Act
        String id = idService.generateId();

        // Assert
        assertNotNull(id, "Generated ID should not be null");
    }

    @Test
    void generateId_returnsNonEmptyString() {
        // Act
        String id = idService.generateId();

        // Assert
        assertFalse(id.isEmpty(), "Generated ID should not be empty");
        assertTrue(!id.isEmpty(), "Generated ID should have positive length");
    }

    @Test
    void generateId_returnsValidUUIDFormat() {
        // Act
        String id = idService.generateId();

        // Assert
        assertDoesNotThrow(() -> UUID.fromString(id),
                "Generated ID should be a valid UUID format");
    }

    @Test
    void generateId_returnsUUIDWithCorrectLength() {
        // Act
        String id = idService.generateId();

        // Assert
        // Standard UUID string format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 characters)
        assertEquals(36, id.length(), "Generated UUID should be 36 characters long");
    }

    @Test
    void generateId_returnsUUIDWithCorrectDashPositions() {
        // Act
        String id = idService.generateId();

        // Assert
        assertEquals('-', id.charAt(8), "UUID should have dash at position 8");
        assertEquals('-', id.charAt(13), "UUID should have dash at position 13");
        assertEquals('-', id.charAt(18), "UUID should have dash at position 18");
        assertEquals('-', id.charAt(23), "UUID should have dash at position 23");
    }

    @Test
    void generateId_returnsUniqueIdsOnMultipleCalls() {
        // Act
        String id1 = idService.generateId();
        String id2 = idService.generateId();
        String id3 = idService.generateId();

        // Assert
        assertNotEquals(id1, id2, "First and second IDs should be different");
        assertNotEquals(id2, id3, "Second and third IDs should be different");
        assertNotEquals(id1, id3, "First and third IDs should be different");
    }

    @Test
    void generateId_generatesUniqueIdsInLargeSet() {
        // Arrange
        int numberOfIds = 1000;
        Set<String> generatedIds = new HashSet<>();

        // Act
        for (int i = 0; i < numberOfIds; i++) {
            String id = idService.generateId();
            generatedIds.add(id);
        }

        // Assert
        assertEquals(numberOfIds, generatedIds.size(),
                "All generated IDs should be unique - no duplicates expected in 1000 IDs");
    }

    @Test
    void generateId_isConsistentAcrossMultipleCalls() {
        // Act
        String id1 = idService.generateId();
        String id2 = idService.generateId();

        // Assert - both should be valid UUIDs
        assertDoesNotThrow(() -> UUID.fromString(id1));
        assertDoesNotThrow(() -> UUID.fromString(id2));
    }

    @Test
    void generateId_returnsVersion4UUID() {
        // Act
        String id = idService.generateId();
        UUID uuid = UUID.fromString(id);

        // Assert
        // UUID version 4 (random) should have version field set to 4
        assertEquals(4, uuid.version(), "Generated UUID should be version 4 (random)");
    }

    @Test
    void generateId_returnsLowercaseHexadecimal() {
        // Act
        String id = idService.generateId();

        // Assert
        // Remove dashes and check if all characters are valid lowercase hex
        String hexPart = id.replace("-", "");
        assertTrue(hexPart.matches("[0-9a-f]+"),
                "UUID should contain only lowercase hexadecimal characters and dashes");
    }

}