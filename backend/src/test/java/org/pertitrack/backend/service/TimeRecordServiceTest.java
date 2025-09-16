package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.mapper.TimeRecordMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.TimeRecordRepository;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class TimeRecordServiceTest {

    @Mock
    private TimeRecordRepository timeRecordRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private TimeRecordMapper timeRecordMapper;

    @InjectMocks
    private TimeRecordService timeRecordService;

    private Employee testEmployee;
    private Employee testApprover;
    private TimeRecord testEntity;
    private TimeRecordRequest testRequest;
    private TimeRecordResponse testResponse;
    private TimeRecordUpdateRequest testUpdateRequest;
//    private TimeRecordApprovalRequest testApprovalRequest;

    @BeforeEach
    void setUp() {
        // Create test employee with String ID
        testEmployee = new Employee();
//        testEmployee.setId("emp-123-abc-456");
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setEmployeeNumber("EMP001");
        testEmployee.setIsActive(true);

        // Create test approver with String ID
        testApprover = new Employee();
//        testApprover.setId("mgr-456-def-789");
        testApprover.setFirstName("Jane");
        testApprover.setLastName("Manager");
        testApprover.setEmployeeNumber("MGR001");
        testApprover.setIsActive(true);

        // Create test entity with String ID
        testEntity = new TimeRecord();
//        testEntity.setId("tr-789-ghi-012");
        testEntity.setEmployee(testEmployee);
        testEntity.setRecordDate(LocalDate.of(2024, 1, 15));
        testEntity.setRecordTime(LocalDateTime.of(2024, 1, 15, 9, 0, 0));
        testEntity.setRecordType(TimeRecord.RecordType.CLOCK_IN);
        testEntity.setLocationType(TimeRecord.LocationType.OFFICE);
        testEntity.setNotes("Morning clock in");
        testEntity.setIsManual(false);
        testEntity.setCreatedAt(LocalDateTime.of(2024, 1, 15, 9, 0, 5));
        testEntity.setUpdatedAt(LocalDateTime.of(2024, 1, 15, 9, 0, 5));

        // Create test request with String employee ID
        testRequest = new TimeRecordRequest(
                "emp-123-abc-456" ,
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0, 0),
                 TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                        "Morning clock in",
                false
        );

        // Create test response with String IDs
        testResponse = new TimeRecordResponse(
                "tr-789-ghi-012",
                "emp-123-abc-456",
                "John",
                "Doe",
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0, 0),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Morning clock in",
                false,
//                false,
                LocalDateTime.of(2024, 1, 15, 9, 0, 5),
                LocalDateTime.of(2024, 1, 15, 9, 0, 5)
           );


        // Create test update request
        testUpdateRequest = new TimeRecordUpdateRequest(
                LocalDate.of(2024, 1, 16),
                LocalDateTime.of(2024, 1, 16, 10, 0, 0),
                TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.HOME,
                "Updated notes",
                true
                );


        // Create test approval request with String approver ID
//        testApprovalRequest = new TimeRecordApprovalRequest(
//                "mgr-456-def-789"
//        );

    }


    // ====================== getAllTimeRecords Tests ======================

    @Test
    void getAllTimeRecords_returnsAllRecords() {
        // Arrange
        List<TimeRecord> entities = Arrays.asList(testEntity);
        List<TimeRecordResponse> expectedResponses = Arrays.asList(testResponse);

        when(timeRecordRepository.findAll()).thenReturn(entities);
        when(timeRecordMapper.toResponseList(entities)).thenReturn(expectedResponses);

        // Act
        List<TimeRecordResponse> result = timeRecordService.getAllTimeRecords();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedResponses, result);
        verify(timeRecordRepository).findAll();
        verify(timeRecordMapper).toResponseList(entities);
    }

    @Test
    void getAllTimeRecords_withEmptyRepository_returnsEmptyList() {
        // Arrange
        List<TimeRecord> entities = Arrays.asList();
        List<TimeRecordResponse> expectedResponses = Arrays.asList();

        when(timeRecordRepository.findAll()).thenReturn(entities);
        when(timeRecordMapper.toResponseList(entities)).thenReturn(expectedResponses);

        // Act
        List<TimeRecordResponse> result = timeRecordService.getAllTimeRecords();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(timeRecordRepository).findAll();
        verify(timeRecordMapper).toResponseList(entities);
    }

    // ====================== getTimeRecordById Tests ======================

    @Test
    void getTimeRecordById_withValidId_returnsTimeRecord() {
        // Arrange
        String timeRecordId = "tr-789-ghi-012";
        when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.of(testEntity));
        when(timeRecordMapper.toResponse(testEntity)).thenReturn(testResponse);

        // Act
        TimeRecordResponse result = timeRecordService.getTimeRecordById(timeRecordId);

        // Assert
        assertNotNull(result);
        assertEquals(testResponse, result);
        verify(timeRecordRepository).findById(timeRecordId);
        verify(timeRecordMapper).toResponse(testEntity);
    }

    @Test
    void getTimeRecordById_withNonExistentId_throwsException() {
        // Arrange
        String timeRecordId = "non-existent-id";
        when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            timeRecordService.getTimeRecordById(timeRecordId);
        });

        assertTrue(exception.getMessage().contains("Time record not found with id: " + timeRecordId));
        verify(timeRecordRepository).findById(timeRecordId);
        verify(timeRecordMapper, never()).toResponse(any());
    }

    // ====================== getTimeRecordsByEmployeeId Tests ======================

    @Test
    void getTimeRecordsByEmployeeId_withValidEmployeeId_returnsRecords() {
        // Arrange
        String employeeId = "emp-123-abc-456";
        List<TimeRecord> entities = Arrays.asList(testEntity);
        List<TimeRecordResponse> expectedResponses = Arrays.asList(testResponse);

        when(timeRecordRepository.findByEmployeeId(employeeId)).thenReturn(entities);
        when(timeRecordMapper.toResponseList(entities)).thenReturn(expectedResponses);

        // Act
        List<TimeRecordResponse> result = timeRecordService.getTimeRecordsByEmployeeId(employeeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedResponses, result);
        verify(timeRecordRepository).findByEmployeeId(employeeId);
        verify(timeRecordMapper).toResponseList(entities);
    }

    @Test
    void getTimeRecordsByEmployeeId_withNoRecords_returnsEmptyList() {
        // Arrange
        String employeeId = "emp-no-records";
        List<TimeRecord> entities = Arrays.asList();
        List<TimeRecordResponse> expectedResponses = Arrays.asList();

        when(timeRecordRepository.findByEmployeeId(employeeId)).thenReturn(entities);
        when(timeRecordMapper.toResponseList(entities)).thenReturn(expectedResponses);

        // Act
        List<TimeRecordResponse> result = timeRecordService.getTimeRecordsByEmployeeId(employeeId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(timeRecordRepository).findByEmployeeId(employeeId);
        verify(timeRecordMapper).toResponseList(entities);
    }

    // ====================== createTimeRecord Tests ======================

    @Test
    void createTimeRecord_withValidRequest_createsAndReturnsRecord() {
        // Arrange
        TimeRecord entityToSave = new TimeRecord();
        TimeRecord savedEntity = testEntity;

        when(employeeRepository.findById("emp-123-abc-456")).thenReturn(Optional.of(testEmployee));
        when(timeRecordMapper.toEntity(testRequest, testEmployee)).thenReturn(entityToSave);
        when(timeRecordRepository.save(entityToSave)).thenReturn(savedEntity);
        when(timeRecordMapper.toResponse(savedEntity)).thenReturn(testResponse);

        // Act
        TimeRecordResponse result = timeRecordService.createTimeRecord(testRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testResponse, result);
        verify(employeeRepository).findById("emp-123-abc-456");
        verify(timeRecordMapper).toEntity(testRequest, testEmployee);
        verify(timeRecordRepository).save(entityToSave);
        verify(timeRecordMapper).toResponse(savedEntity);
    }

    @Test
    void createTimeRecord_withNonExistentEmployee_throwsException() {
        // Arrange
        String employeeId = "non-existent-employee";
        testRequest = testRequest.withEmployeeId(employeeId);
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        // Act & Assert
        EmployeeNotFoundException exception = assertThrows(EmployeeNotFoundException.class, () -> {
            timeRecordService.createTimeRecord(testRequest);
        });

        assertTrue(exception.getMessage().contains("Employee not found with id: " + employeeId));
        verify(employeeRepository).findById(employeeId);
        verify(timeRecordMapper, never()).toEntity(any(), any());
        verify(timeRecordRepository, never()).save(any());
        verify(timeRecordMapper, never()).toResponse(any());
    }

    // ====================== updateTimeRecord Tests ======================

    @Test
    void updateTimeRecord_withValidRequest_updatesAndReturnsRecord() {
        // Arrange
        String timeRecordId = "tr-789-ghi-012";
        TimeRecord updatedEntity = testEntity;

        when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.of(testEntity));
        doNothing().when(timeRecordMapper).updateEntity(testEntity, testUpdateRequest);
        when(timeRecordRepository.save(testEntity)).thenReturn(updatedEntity);
        when(timeRecordMapper.toResponse(updatedEntity)).thenReturn(testResponse);

        // Act
        TimeRecordResponse result = timeRecordService.updateTimeRecord(timeRecordId, testUpdateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testResponse, result);
        verify(timeRecordRepository).findById(timeRecordId);
        verify(timeRecordMapper).updateEntity(testEntity, testUpdateRequest);
        verify(timeRecordRepository).save(testEntity);
        verify(timeRecordMapper).toResponse(updatedEntity);
    }

    @Test
    void updateTimeRecord_withNonExistentId_throwsException() {
        // Arrange
        String timeRecordId = "non-existent-id";
        when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            timeRecordService.updateTimeRecord(timeRecordId, testUpdateRequest);
        });

        assertTrue(exception.getMessage().contains("Time record not found with id: " + timeRecordId));
        verify(timeRecordRepository).findById(timeRecordId);
        verify(timeRecordMapper, never()).updateEntity(any(), any());
        verify(timeRecordRepository, never()).save(any());
        verify(timeRecordMapper, never()).toResponse(any());
    }

    // ====================== deleteTimeRecord Tests ======================

    @Test
    void deleteTimeRecord_withExistentRecord_deletesSuccessfully() {
        // Arrange
        String timeRecordId = "tr-789-ghi-012";
        when(timeRecordRepository.existsById(timeRecordId)).thenReturn(true);

        // Act
        assertDoesNotThrow(() -> {
            timeRecordService.deleteTimeRecord(timeRecordId);
        });

        // Assert
        verify(timeRecordRepository).existsById(timeRecordId);
        verify(timeRecordRepository).deleteById(timeRecordId);
    }

    @Test
    void deleteTimeRecord_withNonExistentRecord_throwsException() {
        // Arrange
        String timeRecordId = "non-existent-record";
        when(timeRecordRepository.existsById(timeRecordId)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            timeRecordService.deleteTimeRecord(timeRecordId);
        });

        assertTrue(exception.getMessage().contains("Time record not found with id: " + timeRecordId));
        verify(timeRecordRepository).existsById(timeRecordId);
        verify(timeRecordRepository, never()).deleteById(timeRecordId);
    }


}