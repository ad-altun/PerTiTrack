package org.pertitrack.backend.entity;

import org.junit.jupiter.api.*;
import org.pertitrack.backend.entity.personnel.*;
import org.springframework.test.context.*;

import java.time.*;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class BaseEntityTest {

    private Employee testEntity;

    @BeforeEach
    void setUp() {
        testEntity = new Employee();
    }

    @Test
    void onCreate_shouldInitializeTimestampsAndVersion() {
        // Act
        testEntity.onCreate();

        // Assert
        assertNotNull(testEntity.getCreatedAt());
        assertNotNull(testEntity.getUpdatedAt());
        assertEquals(0L, testEntity.getVersion());
    }

    @Test
    void onCreate_shouldNotOverrideExistingValues() {
        // Arrange
        LocalDateTime existingCreated = LocalDateTime.of(2023, 1, 1, 10, 0);
        LocalDateTime existingUpdated = LocalDateTime.of(2023, 1, 2, 10, 0);
        testEntity.setCreatedAt(existingCreated);
        testEntity.setUpdatedAt(existingUpdated);
        testEntity.setVersion(5L);

        // Act
        testEntity.onCreate();

        // Assert
        assertEquals(existingCreated, testEntity.getCreatedAt());
        assertEquals(existingUpdated, testEntity.getUpdatedAt());
        assertEquals(5L, testEntity.getVersion());
    }

    @Test
    void onCreate_shouldInitializeNullVersion() {
        // Arrange
        testEntity.setVersion(null);

        // Act
        testEntity.onCreate();

        // Assert
        assertEquals(0L, testEntity.getVersion());
    }

    @Test
    void onUpdate_shouldUpdateTimestamp() {
        // Arrange
        LocalDateTime before = LocalDateTime.now().minusMinutes(1);
        testEntity.setUpdatedAt(before);

        // Act
        testEntity.onUpdate();

        // Assert
        assertTrue(testEntity.getUpdatedAt().isAfter(before));
    }

    @Test
    void setId_shouldSetIdValue() {
        // Arrange
        String testId = "test-id-123";

        // Act
        testEntity.setId(testId);

        // Assert
        assertEquals(testId, testEntity.getId());
    }

}