package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordRequest;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.exceptions.TimeRecordNotFoundException;
import org.pertitrack.backend.mapper.TimeRecordMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.TimeRecordRepository;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


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

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User testUser;
    private Employee testEmployee;
    private Employee testApprover;
    private TimeRecord testEntity;
    private TimeRecordRequest testRequest;
    private TimeRecordResponse testResponse;
    private TimeRecordUpdateRequest testUpdateRequest;
    private TimeRecord testTimeRecord;
    private String userEmail = "testuser@pertitrack.org";
    private String userId = "user-123";
    private String employeeId = "emp-123-abc-456";
    private String timeRecordId = "tr-789-ghi-012";

        // Set up mocks for SecurityContextHolder to simulate authenticated user
    private void mockCurrentUserAndEmployee() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
    }

    @BeforeEach
    void setUp() {
        // Create test user with String ID
        testUser = new User();
        ReflectionTestUtils.setField(testUser, "id", userId);
        testUser.setEmail(userEmail);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        // Create test employee with String ID
        testEmployee = new Employee();
        ReflectionTestUtils.setField(testEmployee, "id", employeeId);
        testEmployee.setUser(testUser);
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setEmployeeNumber("EMP001");
        testEmployee.setIsActive(true);

        // Create test time record
        LocalDateTime recordTime = LocalDateTime.of(2024, 10, 1, 9, 0, 0);
        testTimeRecord = new TimeRecord();
        ReflectionTestUtils.setField(testTimeRecord, "id", timeRecordId);
        testTimeRecord.setEmployee(testEmployee);
        testTimeRecord.setRecordDate(LocalDate.of(2024, 10, 1));
        testTimeRecord.setRecordTime(recordTime);
        testTimeRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
        testTimeRecord.setLocationType(TimeRecord.LocationType.OFFICE);
        testTimeRecord.setNotes("Morning clock in");
        testTimeRecord.setIsManual(false);
        testTimeRecord.setCreatedAt(recordTime);
        testTimeRecord.setUpdatedAt(recordTime);

        testTimeRecord.setEmployee(testEmployee);

        // Create test approver with String ID
        testApprover = new Employee();
        testApprover.setFirstName("Jane");
        testApprover.setLastName("Manager");
        testApprover.setEmployeeNumber("MGR001");
        testApprover.setIsActive(true);

        // Create test entity with String ID
        testEntity = new TimeRecord();
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
    }

    /**
     * Tests for authentication and authorization related methods in TimeRecordService:
     * - getCurrentUser
     * - getCurrentEmployee
     * - getMyTodayRecords
     * - updateTimeRecordNotes
     */
    @Nested
    class GetCurrentUserTests {

        @Test
        void getCurrentUser_withAuthenticatedUser_returnsUser() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));

            // Act - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentUser");
                method.setAccessible(true);
                User result = (User) method.invoke(timeRecordService);

                // Assert
                assertNotNull(result);
                assertEquals(userId, result.getId());
                assertEquals(userEmail, result.getEmail());
                verify(userRepository).findByEmail(userEmail);
            } catch (Exception e) {
                fail("Failed to test getCurrentUser: " + e.getMessage());
            }
        }

        @Test
        void getCurrentUser_withNonExistentUser_throwsEmployeeNotFoundException() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

            // Act & Assert - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentUser");
                method.setAccessible(true);

                Exception exception = assertThrows(Exception.class, () -> {
                    method.invoke(timeRecordService);
                });

                // The InvocationTargetException wraps the actual exception
                assertTrue(exception.getCause() instanceof EmployeeNotFoundException);
                assertTrue(exception.getCause().getMessage().contains("Current user not found"));
                verify(userRepository).findByEmail(userEmail);
            } catch (Exception e) {
                fail("Failed to test getCurrentUser exception: " + e.getMessage());
            }
        }

        @Test
        void getCurrentUser_withNoAuthentication_throwsException() {
            // Arrange
            when(securityContext.getAuthentication()).thenReturn(null);
            SecurityContextHolder.setContext(securityContext);

            // Act & Assert - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentUser");
                method.setAccessible(true);

                assertThrows(Exception.class, () -> {
                    method.invoke(timeRecordService);
                });
            } catch (Exception e) {
                fail("Failed to test getCurrentUser with no authentication: " + e.getMessage());
            }
        }
    }

    // ====================== getCurrentEmployee Tests ======================

    @Nested
    class GetCurrentEmployeeTests {

        @Test
        void getCurrentEmployee_withValidUserAndEmployee_returnsEmployee() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));

            // Act - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentEmployee");
                method.setAccessible(true);
                Employee result = (Employee) method.invoke(timeRecordService);

                // Assert
                assertNotNull(result);
                assertEquals(employeeId, result.getId());
                assertEquals(testUser, result.getUser());
                verify(userRepository).findByEmail(userEmail);
                verify(employeeRepository).findByUser_Id(userId);
            } catch (Exception e) {
                fail("Failed to test getCurrentEmployee: " + e.getMessage());
            }
        }

        @Test
        void getCurrentEmployee_withUserButNoEmployee_throwsEmployeeNotFoundException() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

            // Act & Assert - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentEmployee");
                method.setAccessible(true);

                Exception exception = assertThrows(Exception.class, () -> {
                    method.invoke(timeRecordService);
                });

                assertTrue(exception.getCause() instanceof EmployeeNotFoundException);
                assertTrue(exception.getCause().getMessage().contains("Current employee not found"));
                verify(userRepository).findByEmail(userEmail);
                verify(employeeRepository).findByUser_Id(userId);
            } catch (Exception e) {
                fail("Failed to test getCurrentEmployee exception: " + e.getMessage());
            }
        }

        @Test
        void getCurrentEmployee_withNoUser_throwsEmployeeNotFoundException() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

            // Act & Assert - Use reflection to call the private method
            try {
                java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod("getCurrentEmployee");
                method.setAccessible(true);

                Exception exception = assertThrows(Exception.class, () -> {
                    method.invoke(timeRecordService);
                });

                assertTrue(exception.getCause() instanceof EmployeeNotFoundException);
                verify(userRepository).findByEmail(userEmail);
                verify(employeeRepository, never()).findByUser_Id(any());
            } catch (Exception e) {
                fail("Failed to test getCurrentEmployee with no user: " + e.getMessage());
            }
        }
    }

    // ====================== getMyTodayRecords Tests ======================

    @Nested
    class GetMyTodayRecordsTests {

        @Test
        void getMyTodayRecords_withRecordsExisting_returnsRecordsList() {
            // Arrange
            LocalDate today = LocalDate.now();
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));

            List<TimeRecord> timeRecords = Arrays.asList(testTimeRecord);
            List<TimeRecordResponse> expectedResponses = Arrays.asList(testResponse);

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeDesc(
                    testEmployee, today)).thenReturn(timeRecords);
            when(timeRecordMapper.toResponseList(timeRecords)).thenReturn(expectedResponses);

            // Act
            List<TimeRecordResponse> result = timeRecordService.getMyTodayRecords();

            // Assert
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(testResponse, result.get(0));
            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository).findByUser_Id(userId);
            verify(timeRecordRepository).findByEmployeeAndRecordDateOrderByRecordTimeDesc(testEmployee, today);
            verify(timeRecordMapper).toResponseList(timeRecords);
        }

        @Test
        void getMyTodayRecords_withNoRecordsToday_returnsEmptyList() {
            // Arrange
            LocalDate today = LocalDate.now();
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));

            List<TimeRecord> emptyList = Collections.emptyList();
            List<TimeRecordResponse> emptyResponseList = Collections.emptyList();

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeDesc(
                    testEmployee, today)).thenReturn(emptyList);
            when(timeRecordMapper.toResponseList(emptyList)).thenReturn(emptyResponseList);

            // Act
            List<TimeRecordResponse> result = timeRecordService.getMyTodayRecords();

            // Assert
            assertNotNull(result);
            assertTrue(result.isEmpty());
            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository).findByUser_Id(userId);
            verify(timeRecordRepository).findByEmployeeAndRecordDateOrderByRecordTimeDesc(testEmployee, today);
            verify(timeRecordMapper).toResponseList(emptyList);
        }

        @Test
        void getMyTodayRecords_withMultipleRecords_returnsAllRecords() {
            // Arrange
            LocalDate today = LocalDate.now();
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));

            // Create multiple time records
            TimeRecord clockIn = testTimeRecord;

            TimeRecord breakStart = new TimeRecord();
            ReflectionTestUtils.setField(breakStart, "id", "tr-790");
            breakStart.setEmployee(testEmployee);
            breakStart.setRecordDate(today);
            breakStart.setRecordTime(LocalDateTime.now().withHour(12).withMinute(0));
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setLocationType(TimeRecord.LocationType.OFFICE);

            List<TimeRecord> timeRecords = Arrays.asList(breakStart, clockIn);
            List<TimeRecordResponse> expectedResponses = Arrays.asList(testResponse, testResponse);

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeDesc(
                    testEmployee, today)).thenReturn(timeRecords);
            when(timeRecordMapper.toResponseList(timeRecords)).thenReturn(expectedResponses);

            // Act
            List<TimeRecordResponse> result = timeRecordService.getMyTodayRecords();

            // Assert
            assertNotNull(result);
            assertEquals(2, result.size());
            verify(timeRecordRepository).findByEmployeeAndRecordDateOrderByRecordTimeDesc(testEmployee, today);
            verify(timeRecordMapper).toResponseList(timeRecords);
        }

        @Test
        void getMyTodayRecords_withNoEmployee_throwsEmployeeNotFoundException() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class, () -> {
                timeRecordService.getMyTodayRecords();
            });

            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository).findByUser_Id(userId);
            verify(timeRecordRepository, never()).findByEmployeeAndRecordDateOrderByRecordTimeDesc(any(), any());
        }

        @Test
        void getMyTodayRecords_withNoUser_throwsEmployeeNotFoundException() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class, () -> {
                timeRecordService.getMyTodayRecords();
            });

            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository, never()).findByUser_Id(any());
            verify(timeRecordRepository, never()).findByEmployeeAndRecordDateOrderByRecordTimeDesc(any(), any());
        }
    }

    // ====================== updateTimeRecordNotes Tests ======================

    @Nested
    class UpdateTimeRecordNotesTests {

        @Test
        void updateTimeRecordNotes_withValidRequest_updatesAndReturnsRecord() {
            // Arrange
            mockCurrentUserAndEmployee();
            String newNotes = "Updated notes for the record";
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
            when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.of(testTimeRecord));

            TimeRecord updatedRecord = testTimeRecord;
            updatedRecord.setNotes(newNotes);

            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(updatedRecord);
            when(timeRecordMapper.toResponse(updatedRecord)).thenReturn(testResponse);

            // Act
            TimeRecordResponse result = timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);

            // Assert
            assertNotNull(result);
            assertEquals(testResponse, result);
            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository).findByUser_Id(userId);
            verify(timeRecordRepository).findById(timeRecordId);
            verify(timeRecordRepository).save(any(TimeRecord.class));
            verify(timeRecordMapper).toResponse(updatedRecord);

            // Verify the notes were actually updated
            assertEquals(newNotes, testTimeRecord.getNotes());
        }

        @Test
        void updateTimeRecordNotes_withNonExistentRecord_throwsTimeRecordNotFoundException() {
            // Arrange
            mockCurrentUserAndEmployee();
            String newNotes = "Updated notes";
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
            when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(TimeRecordNotFoundException.class, () -> {
                timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);
            });

            verify(timeRecordRepository).findById(timeRecordId);
            verify(timeRecordRepository, never()).save(any());
            verify(timeRecordMapper, never()).toResponse(any());
        }

        @Test
        void updateTimeRecordNotes_withOtherEmployeesRecord_throwsSecurityException() {
            // Arrange
            String newNotes = "Trying to update someone else's notes";

            // Create a different employee
            Employee otherEmployee = new Employee();
            ReflectionTestUtils.setField(otherEmployee, "id", "other-emp-999");
            otherEmployee.setEmployeeNumber("EMP999");

            // Set the time record to belong to the other employee
            testTimeRecord.setEmployee(otherEmployee);

            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
            when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.of(testTimeRecord));

            // Act & Assert
            SecurityException exception = assertThrows(SecurityException.class, () -> {
                timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);
            });

            assertTrue(exception.getMessage().contains("You can only update your own time records"));
            verify(timeRecordRepository).findById(timeRecordId);
            verify(timeRecordRepository, never()).save(any());
            verify(timeRecordMapper, never()).toResponse(any());
        }

        @Test
        void updateTimeRecordNotes_withNoEmployee_throwsEmployeeNotFoundException() {
            // Arrange
            String newNotes = "Updated notes";
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class, () -> {
                timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);
            });

            verify(employeeRepository).findByUser_Id(userId);
            verify(timeRecordRepository, never()).findById(any());
            verify(timeRecordRepository, never()).save(any());
        }

        @Test
        void updateTimeRecordNotes_withNoUser_throwsEmployeeNotFoundException() {
            // Arrange
            String newNotes = "Updated notes";
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class, () -> {
                timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);
            });

            verify(userRepository).findByEmail(userEmail);
            verify(employeeRepository, never()).findByUser_Id(any());
            verify(timeRecordRepository, never()).findById(any());
        }

        @Test
        void updateTimeRecordNotes_updatesTimestamp() {
            // Arrange
            String newNotes = "Notes with timestamp update";
            LocalDateTime originalTimestamp = testTimeRecord.getUpdatedAt();

            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
            when(timeRecordRepository.findById(timeRecordId)).thenReturn(Optional.of(testTimeRecord));
            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(testTimeRecord);
            when(timeRecordMapper.toResponse(testTimeRecord)).thenReturn(testResponse);

            // Act
            timeRecordService.updateTimeRecordNotes(timeRecordId, newNotes);

            // Assert
            assertNotNull(testTimeRecord.getUpdatedAt());
            assertNotEquals(originalTimestamp, testTimeRecord.getUpdatedAt());
            verify(timeRecordRepository).save(testTimeRecord);
        }
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