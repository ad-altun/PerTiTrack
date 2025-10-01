package org.pertitrack.backend.dto.timeTrackingDto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class CurrentStatusResponseTest {
    private TimeRecordResponse mockTimeRecordResponse;
    private CurrentStatusResponse currentStatusResponse;

    @BeforeEach
    void setUp() {
        mockTimeRecordResponse = new TimeRecordResponse(
                "550e8400-e29b-41d4-a716-446655440000",
                "emp-001",
                "John",
                "Doe",
                LocalDate.now(),
                LocalDateTime.now(),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Test notes",
                false,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        currentStatusResponse = new CurrentStatusResponse(
                true,
                false,
                "OFFICE",
                mockTimeRecordResponse
        );
    }

    @Test
    void constructor_createsObjectWithAllFields() {
        // Assert
        assertNotNull(currentStatusResponse);
        assertTrue(currentStatusResponse.isWorking());
        assertFalse(currentStatusResponse.isOnBreak());
        assertEquals("OFFICE", currentStatusResponse.currentLocation());
        assertEquals(mockTimeRecordResponse, currentStatusResponse.lastEntry());
    }

    @Test
    void record_isImmutable() {
        // Arrange
        CurrentStatusResponse original = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );

        // Act
        CurrentStatusResponse modified = original.withWorking(false);

        // Assert
        assertTrue(original.isWorking());
        assertFalse(modified.isWorking());
        assertNotSame(original, modified);
    }

    @Test
    void withIsWorking_createsNewInstanceWithUpdatedValue() {
        // Act
        CurrentStatusResponse updated = currentStatusResponse.withWorking(false);

        // Assert
        assertTrue(currentStatusResponse.isWorking());
        assertFalse(updated.isWorking());
        assertEquals(currentStatusResponse.isOnBreak(), updated.isOnBreak());
        assertEquals(currentStatusResponse.currentLocation(), updated.currentLocation());
        assertEquals(currentStatusResponse.lastEntry(), updated.lastEntry());
    }

    @Test
    void withIsOnBreak_createsNewInstanceWithUpdatedValue() {
        // Act
        CurrentStatusResponse updated = currentStatusResponse.withOnBreak(true);

        // Assert
        assertFalse(currentStatusResponse.isOnBreak());
        assertTrue(updated.isOnBreak());
        assertEquals(currentStatusResponse.isWorking(), updated.isWorking());
        assertEquals(currentStatusResponse.currentLocation(), updated.currentLocation());
        assertEquals(currentStatusResponse.lastEntry(), updated.lastEntry());
    }

    @Test
    void withCurrentLocation_createsNewInstanceWithUpdatedValue() {
        // Act
        CurrentStatusResponse updated = currentStatusResponse.withCurrentLocation("HOME");

        // Assert
        assertEquals("OFFICE", currentStatusResponse.currentLocation());
        assertEquals("HOME", updated.currentLocation());
        assertEquals(currentStatusResponse.isWorking(), updated.isWorking());
        assertEquals(currentStatusResponse.isOnBreak(), updated.isOnBreak());
        assertEquals(currentStatusResponse.lastEntry(), updated.lastEntry());
    }

    @Test
    void withLastEntry_createsNewInstanceWithUpdatedValue() {
        // Arrange
        TimeRecordResponse newEntry = mockTimeRecordResponse.withId("new-id");

        // Act
        CurrentStatusResponse updated = currentStatusResponse.withLastEntry(newEntry);

        // Assert
        assertEquals(mockTimeRecordResponse, currentStatusResponse.lastEntry());
        assertEquals(newEntry, updated.lastEntry());
        assertEquals(currentStatusResponse.isWorking(), updated.isWorking());
        assertEquals(currentStatusResponse.isOnBreak(), updated.isOnBreak());
        assertEquals(currentStatusResponse.currentLocation(), updated.currentLocation());
    }

    @Test
    void constructor_handlesNullLastEntry() {
        // Act
        CurrentStatusResponse response = new CurrentStatusResponse(
                false, false, null, null
        );

        // Assert
        assertNotNull(response);
        assertFalse(response.isWorking());
        assertFalse(response.isOnBreak());
        assertNull(response.currentLocation());
        assertNull(response.lastEntry());
    }

    @Test
    void constructor_handlesNullLocation() {
        // Act
        CurrentStatusResponse response = new CurrentStatusResponse(
                true, false, null, mockTimeRecordResponse
        );

        // Assert
        assertTrue(response.isWorking());
        assertNull(response.currentLocation());
        assertNotNull(response.lastEntry());
    }

    @Test
    void equals_returnsTrueForSameValues() {
        // Arrange
        CurrentStatusResponse response1 = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );
        CurrentStatusResponse response2 = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );

        // Assert
        assertEquals(response1, response2);
    }

    @Test
    void equals_returnsFalseForDifferentValues() {
        // Arrange
        CurrentStatusResponse response1 = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );
        CurrentStatusResponse response2 = new CurrentStatusResponse(
                false, false, "OFFICE", mockTimeRecordResponse
        );

        // Assert
        assertNotEquals(response1, response2);
    }

    @Test
    void hashCode_isSameForEqualObjects() {
        // Arrange
        CurrentStatusResponse response1 = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );
        CurrentStatusResponse response2 = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );

        // Assert
        assertEquals(response1.hashCode(), response2.hashCode());
    }

    @Test
    void toString_containsAllFields() {
        // Act
        String result = currentStatusResponse.toString();

        // Assert
        assertTrue(result.contains("isWorking"));
        assertTrue(result.contains("isOnBreak"));
        assertTrue(result.contains("currentLocation"));
        assertTrue(result.contains("lastEntry"));
    }

    @Test
    void constructor_handlesWorkingAndOnBreak() {
        // Act
        CurrentStatusResponse response = new CurrentStatusResponse(
                true, true, "OFFICE", mockTimeRecordResponse
        );

        // Assert
        assertTrue(response.isWorking());
        assertTrue(response.isOnBreak());
    }

    @Test
    void constructor_handlesNotWorkingNotOnBreak() {
        // Act
        CurrentStatusResponse response = new CurrentStatusResponse(
                false, false, null, null
        );

        // Assert
        assertFalse(response.isWorking());
        assertFalse(response.isOnBreak());
    }

    @Test
    void withMethods_canBeChained() {
        // Act
        CurrentStatusResponse updated = currentStatusResponse
                .withWorking(false)
                .withOnBreak(true)
                .withCurrentLocation("HOME")
                .withLastEntry(null);

        // Assert
        assertFalse(updated.isWorking());
        assertTrue(updated.isOnBreak());
        assertEquals("HOME", updated.currentLocation());
        assertNull(updated.lastEntry());
    }

    @Test
    void constructor_handlesDifferentLocations() {
        // Arrange & Act
        CurrentStatusResponse officeResponse = new CurrentStatusResponse(
                true, false, "OFFICE", mockTimeRecordResponse
        );
        CurrentStatusResponse homeResponse = new CurrentStatusResponse(
                true, false, "HOME", mockTimeRecordResponse
        );
        CurrentStatusResponse businessTripResponse = new CurrentStatusResponse(
                true, false, "BUSINESS_TRIP", mockTimeRecordResponse
        );

        // Assert
        assertEquals("OFFICE", officeResponse.currentLocation());
        assertEquals("HOME", homeResponse.currentLocation());
        assertEquals("BUSINESS_TRIP", businessTripResponse.currentLocation());
    }
}