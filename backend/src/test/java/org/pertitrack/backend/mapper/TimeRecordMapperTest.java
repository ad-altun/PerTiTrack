package org.pertitrack.backend.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class TimeRecordMapperTest {

    @InjectMocks
    private TimeRecordMapper timeRecordMapper;

    private Employee testEmployee;
    private Employee testApprover;
    private TimeRecordRequest testRequest;
    private TimeRecord testEntity;
    private TimeRecordUpdateRequest testUpdateRequest;

    @BeforeEach
    void setUp() {
        // Create test employee
        testEmployee = new Employee();
        testEmployee.setId("emp-123");
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setEmployeeNumber("EMP001");
        testEmployee.setIsActive(true);

        // Create test approver
        testApprover = new Employee();
        testApprover.setId("mgr-456");
        testApprover.setFirstName("Jane");
        testApprover.setLastName("Manager");
        testEmployee.setEmployeeNumber("MGR001");
        testApprover.setIsActive(true);

        // Create test request
        testRequest = new TimeRecordRequest(
                "emp-123",
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0, 0),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Morning clock in",
                false
                );

        // Create test entity
        testEntity = new TimeRecord();
        testEntity.setId("tr-789");
        testEntity.setEmployee(testEmployee);
        testEntity.setRecordDate(LocalDate.of(2024, 1, 15));
        testEntity.setRecordTime(LocalDateTime.of(2024, 1, 15, 9, 0, 0));
        testEntity.setRecordType(TimeRecord.RecordType.CLOCK_IN);
        testEntity.setLocationType(TimeRecord.LocationType.OFFICE);
        testEntity.setNotes("Morning clock in");
        testEntity.setIsManual(false);
        testEntity.setCreatedAt(LocalDateTime.of(2024, 1, 15, 9, 0, 5));
        testEntity.setUpdatedAt(LocalDateTime.of(2024, 1, 15, 9, 0, 5));

        // Create test update request
        testUpdateRequest = new TimeRecordUpdateRequest(
                LocalDate.of(2024, 1, 16),
                LocalDateTime.of(2024, 1, 16, 10, 0, 0),
                TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.HOME,
                "Updated notes",
                true
        );
    }

    // ====================== toEntity Tests ======================

    @Test
    void toEntity_withValidRequestAndEmployee_returnsTimeRecord() {
        // Act
        TimeRecord result = timeRecordMapper.toEntity(testRequest, testEmployee);

        // Assert
        assertNotNull(result);
        assertEquals(testEmployee, result.getEmployee());
        assertEquals(testRequest.recordDate(), result.getRecordDate());
        assertEquals(testRequest.recordTime(), result.getRecordTime());
        assertEquals(testRequest.recordType(), result.getRecordType());
        assertEquals(testRequest.locationType(), result.getLocationType());
        assertEquals(testRequest.notes(), result.getNotes());
        assertEquals(testRequest.isManual(), result.getIsManual());
        assertNull(result.getId()); // ID should not be set during creation
    }

    @Test
    void toEntity_withNullRequest_returnsNull() {
        // Act
        TimeRecord result = timeRecordMapper.toEntity(null, testEmployee);

        // Assert
        assertNull(result);
    }

    // ====================== toResponse Tests ======================

    @Test
    void toResponse_withValidEntity_returnsTimeRecordResponse() {
        // Act
        TimeRecordResponse result = timeRecordMapper.toResponse(testEntity);

        // Assert
        assertNotNull(result);
        assertEquals(testEntity.getId(), result.id());
        assertEquals(testEntity.getEmployee().getId(), result.employeeId());
        assertEquals(testEntity.getEmployee().getFirstName(), result.employeeFirstName());
        assertEquals(testEntity.getEmployee().getLastName(), result.employeeLastName());
        assertEquals(testEntity.getRecordDate(), result.recordDate());
        assertEquals(testEntity.getRecordTime(), result.recordTime());
        assertEquals(testEntity.getRecordType(), result.recordType());
        assertEquals(testEntity.getLocationType(), result.locationType());
        assertEquals(testEntity.getNotes(), result.notes());
        assertEquals(testEntity.getIsManual(), result.isManual());
        assertEquals(testEntity.isApproved(), result.isApproved());
        assertEquals(testEntity.getCreatedAt(), result.createdAt());
        assertEquals(testEntity.getUpdatedAt(), result.updatedAt());
    }

    @Test
    void toResponse_withNullEntity_returnsNull() {
        // Act
        TimeRecordResponse result = timeRecordMapper.toResponse(null);

        // Assert
        assertNull(result);
    }

}