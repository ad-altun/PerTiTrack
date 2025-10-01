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

import java.time.Duration;
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
import static org.mockito.Mockito.times;
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
    private LocalDate today;
    private LocalDateTime now;

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
        today = LocalDate.now();
        now = LocalDateTime.now();
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

//     --- Nested tests for quickClockIn ---
//    ---------------------------------------------------------------
    @Nested
    class QuickClockInTests {

    @Test
    void quickClockIn_Success_NoPreviousRecord() {
        // Arrange
        mockCurrentUserAndEmployee();
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();
        String notes = "Morning clock-in";
        TimeRecord savedTimeRecord = new TimeRecord();
        TimeRecordResponse expectedResponse = new TimeRecordResponse("tr1", employeeId, "FN", "LN", today, now, TimeRecord.RecordType.CLOCK_IN, TimeRecord.LocationType.OFFICE, notes, false, now, now);

        // Mock that employee is not already clocked in (empty records)
        when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                testEmployee, today))
                .thenReturn(Collections.emptyList());

        when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
        when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

        // Act
        TimeRecordResponse response = timeRecordService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, notes);

        // Assert
        assertNotNull(response);
        assertEquals(expectedResponse, response);
        verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        verify(timeRecordMapper, times(1)).toResponse(any(TimeRecord.class));
    }

    @Test
    void quickClockIn_ThrowsException_AlreadyClockedIn() {
        // Arrange
        mockCurrentUserAndEmployee();
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        // Mock that employee is already clocked in (has CLOCK_IN)
        TimeRecord clockInRecord = new TimeRecord();
        clockInRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
        clockInRecord.setRecordTime(now.minusHours(2));

        when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                testEmployee, today))
                .thenReturn(Arrays.asList(clockInRecord));

        // Act & Assert
        IllegalStateException thrown = assertThrows(IllegalStateException.class,
                () -> timeRecordService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, ""));
        assertEquals("Employee is already clocked in. Please clock out first.", thrown.getMessage());
        verify(timeRecordRepository, never()).save(any(TimeRecord.class));
    }

        @Test
        void quickClockIn_ThrowsException_EmployeeNotFound() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class,
                    () -> timeRecordService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, ""));
        }
    }

    // --- Nested tests for quickClockOut ---
    @Nested
    class QuickClockOutTests {

        @Test
        void quickClockOut_Success() {
            // Arrange
            mockCurrentUserAndEmployee();
            String notes = "End of day";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse = new TimeRecordResponse("tr2", employeeId, "FN", "LN", today, now, TimeRecord.RecordType.CLOCK_OUT, TimeRecord.LocationType.OFFICE, notes, false, now, now);

            // Mock that employee is clocked in (has CLOCK_IN, no CLOCK_OUT)
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockInRecord.setRecordTime(now.minusHours(8)); // Clocked in 8 hours ago

            // Mock the repository call that getCurrentStatusForEmployee uses
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Arrays.asList(clockInRecord));

            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeRecordService.quickClockOut(
                    TimeRecord.RecordType.CLOCK_OUT, notes);

            // Assert
            assertNotNull(response);
            assertEquals(expectedResponse, response);
            verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        }

        @Test
        void quickClockOut_ThrowsException_NotClockedIn() {
            // Arrange
            mockCurrentUserAndEmployee();
            LocalDate today = LocalDate.now();

            // Mock that employee is NOT clocked in (empty records)
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Collections.emptyList());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeRecordService.quickClockOut(TimeRecord.RecordType.CLOCK_OUT, ""));
            assertEquals("Employee is not clocked in. Cannot clock out.", thrown.getMessage());
        }
    }

    // --- Nested tests for quickBreakStart ---
    @Nested
    class QuickBreakStartTests {

        @Test
        void quickBreakStart_Success() {
            // Arrange
            mockCurrentUserAndEmployee();
            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();
            String notes = "Lunch break";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse =
                    new TimeRecordResponse("tr3", employeeId, "FN", "LN",
                            today, now, TimeRecord.RecordType.BREAK_START,
                            TimeRecord.LocationType.OFFICE, notes, false, now, now);

            // Mock that employee is clocked in (has CLOCK_IN, no CLOCK_OUT, no active break)
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockInRecord.setRecordTime(now.minusHours(2));

            // Mock the repository call that getCurrentStatusForEmployee uses
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Arrays.asList(clockInRecord)); // Only clock in, no break

            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeRecordService.quickBreakStart(
                    TimeRecord.RecordType.BREAK_START, notes);

            // Assert
            assertNotNull(response);
            assertEquals(expectedResponse, response);
            verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        }

        @Test
        void quickBreakStart_ThrowsException_NotClockedIn() {
            // Arrange
            mockCurrentUserAndEmployee();
            LocalDate today = LocalDate.now();

            // Mock that employee is NOT clocked in (empty list)
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Collections.emptyList());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeRecordService.quickBreakStart(TimeRecord.RecordType.BREAK_START, ""));
            assertEquals("Employee must be clocked in to start break.", thrown.getMessage());
        }

        @Test
        void quickBreakStart_ThrowsException_AlreadyOnBreak() {
            // Arrange
            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();

            mockCurrentUserAndEmployee();

            // Mock that employee is clocked in - SET THE EMPLOYEE!
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setEmployee(testEmployee);  // ADD THIS
            clockInRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockInRecord.setRecordTime(now.minusHours(2));

            // Mock that employee is already on break - SET THE EMPLOYEE!
            TimeRecord breakStartRecord = new TimeRecord();
            breakStartRecord.setEmployee(testEmployee);  // ADD THIS
            breakStartRecord.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStartRecord.setRecordTime(now.minusMinutes(30));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    any(Employee.class), any(LocalDate.class)))
                    .thenReturn(Arrays.asList(clockInRecord, breakStartRecord));

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeRecordService.quickBreakStart(TimeRecord.RecordType.BREAK_START, ""));
            assertEquals("Employee is already on break.", thrown.getMessage());
            verify(timeRecordRepository, never()).save(any(TimeRecord.class));
        }
    }

    // --- Nested tests for quickBreakEnd ---
    @Nested
    class QuickBreakEndTests {

        @Test
        void quickBreakEnd_Success() {
            // Arrange
            mockCurrentUserAndEmployee();
            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();
            String notes = "Back from lunch";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse = new TimeRecordResponse("tr4", employeeId, "FN", "LN", today, now, TimeRecord.RecordType.BREAK_END, TimeRecord.LocationType.OFFICE, notes, false, now, now);


            // Mock that employee is clocked in
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockInRecord.setRecordTime(now.minusHours(3));
            // Mock that employee is on break (has BREAK_START, no BREAK_END)
            TimeRecord breakStartRecord = new TimeRecord();
            breakStartRecord.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStartRecord.setRecordTime(now.minusMinutes(30));

            // Mock the repository call that getCurrentStatusForEmployee uses
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Arrays.asList(clockInRecord, breakStartRecord));

            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeRecordService.quickBreakEnd(TimeRecord.RecordType.BREAK_END, notes);

            // Assert
            assertNotNull(response);
            assertEquals(expectedResponse, response);
            verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        }

        @Test
        void quickBreakEnd_ThrowsException_NotOnBreak() {
            // Arrange
            mockCurrentUserAndEmployee();
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today))
                    .thenReturn(Collections.emptyList());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeRecordService.quickBreakEnd(TimeRecord.RecordType.BREAK_END, ""));
            assertEquals("Employee is not on break. " +
                    "Cannot end break.", thrown.getMessage());
        }
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

    /**
     * Tests for private helper methods:
     * - getCurrentStatusForEmployee
     * - canClockIn
     * - canClockOut
     * - canStartBreak
     * - canEndBreak
     * - createTimeRecord (private helper)
     * - calculateCurrentStatus
     * - calculateTodaySummary
     * - formatDurationNoSeconds
     * - formatFlexTimeNoSeconds
     */

    @Nested
    class CalculateCurrentStatusTests {

        @Test
        void calculateCurrentStatus_withEmptyRecords_returnsNotStarted() throws Exception {
            // Arrange
            List<TimeRecord> emptyRecords = Collections.emptyList();

            // Act - Use reflection to call the private method
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateCurrentStatus", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, emptyRecords);

            // Assert
            assertNotNull(result);
            assertEquals("Not Started", getFieldValue(result, "status"));
            assertFalse((Boolean) getFieldValue(result, "isWorking"));
            assertFalse((Boolean) getFieldValue(result, "isOnBreak"));
        }

        @Test
        void calculateCurrentStatus_withOnlyClockIn_returnsWorking() throws Exception {
            // Arrange
            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));
            List<TimeRecord> records = Arrays.asList(clockIn);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateCurrentStatus", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertEquals("Working", getFieldValue(result, "status"));
            assertTrue((Boolean) getFieldValue(result, "isWorking"));
            assertFalse((Boolean) getFieldValue(result, "isOnBreak"));
        }

        @Test
        void calculateCurrentStatus_withClockInAndBreakStart_returnsBreak() throws Exception {
            // Arrange
            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(3));

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(LocalDateTime.now().minusMinutes(30));

            List<TimeRecord> records = Arrays.asList(clockIn, breakStart);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateCurrentStatus", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertEquals("Break", getFieldValue(result, "status"));
            assertFalse((Boolean) getFieldValue(result, "isWorking"));
            assertTrue((Boolean) getFieldValue(result, "isOnBreak"));
        }

        @Test
        void calculateCurrentStatus_withCompleteWorkday_returnsFinished() throws Exception {
            // Arrange
            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(8));

            TimeRecord clockOut = new TimeRecord();
            clockOut.setRecordType(TimeRecord.RecordType.CLOCK_OUT);
            clockOut.setRecordTime(LocalDateTime.now().minusHours(1));

            List<TimeRecord> records = Arrays.asList(clockIn, clockOut);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateCurrentStatus", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertEquals("Finished", getFieldValue(result, "status"));
            assertFalse((Boolean) getFieldValue(result, "isWorking"));
            assertFalse((Boolean) getFieldValue(result, "isOnBreak"));
        }

        @Test
        void calculateCurrentStatus_withClockInBreakAndBreakEnd_returnsWorking() throws Exception {
            // Arrange
            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(4));

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(LocalDateTime.now().minusHours(1));

            TimeRecord breakEnd = new TimeRecord();
            breakEnd.setRecordType(TimeRecord.RecordType.BREAK_END);
            breakEnd.setRecordTime(LocalDateTime.now().minusMinutes(30));

            List<TimeRecord> records = Arrays.asList(clockIn, breakStart, breakEnd);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateCurrentStatus", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertEquals("Working", getFieldValue(result, "status"));
            assertTrue((Boolean) getFieldValue(result, "isWorking"));
            assertFalse((Boolean) getFieldValue(result, "isOnBreak"));
        }

        // Helper method to access private fields using reflection
        private Object getFieldValue(Object obj, String fieldName) throws Exception {
            java.lang.reflect.Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        }
    }

    @Nested
    class CalculateTodaySummaryTests {

        @Test
        void calculateTodaySummary_withEmptyRecords_returnsDefaultSummary() throws Exception {
            // Arrange
            List<TimeRecord> emptyRecords = Collections.emptyList();

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateTodaySummary", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, emptyRecords);

            // Assert
            assertNotNull(result);
            // Use reflection to check fields in TodaySummaryResponse
            java.lang.reflect.Method getStatus = result.getClass().getMethod("status");
            assertEquals("Not Started", getStatus.invoke(result));
        }

        @Test
        void calculateTodaySummary_withClockInOnly_calculatesCorrectly() throws Exception {
            // Arrange
            LocalDateTime clockInTime = LocalDateTime.now().minusHours(2);
            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(clockInTime);
            List<TimeRecord> records = Arrays.asList(clockIn);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateTodaySummary", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertNotNull(result);
            java.lang.reflect.Method getStatus = result.getClass().getMethod("status");
            assertEquals("Working", getStatus.invoke(result));

            java.lang.reflect.Method getArrivalTime = result.getClass().getMethod("arrivalTime");
            assertNotNull(getArrivalTime.invoke(result));
        }

        @Test
        void calculateTodaySummary_withFullWorkday_calculatesAllFields() throws Exception {
            // Arrange
            LocalDateTime clockInTime = LocalDateTime.of(2024, 10, 1, 9, 0);
            LocalDateTime breakStartTime = LocalDateTime.of(2024, 10, 1, 12, 0);
            LocalDateTime breakEndTime = LocalDateTime.of(2024, 10, 1, 12, 30);
            LocalDateTime clockOutTime = LocalDateTime.of(2024, 10, 1, 17, 0);

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(clockInTime);

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(breakStartTime);

            TimeRecord breakEnd = new TimeRecord();
            breakEnd.setRecordType(TimeRecord.RecordType.BREAK_END);
            breakEnd.setRecordTime(breakEndTime);

            TimeRecord clockOut = new TimeRecord();
            clockOut.setRecordType(TimeRecord.RecordType.CLOCK_OUT);
            clockOut.setRecordTime(clockOutTime);

            List<TimeRecord> records = Arrays.asList(clockIn, breakStart, breakEnd, clockOut);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateTodaySummary", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertNotNull(result);
            java.lang.reflect.Method getStatus = result.getClass().getMethod("status");
            assertEquals("Finished", getStatus.invoke(result));

            java.lang.reflect.Method getArrivalTime = result.getClass().getMethod("arrivalTime");
            assertNotNull(getArrivalTime.invoke(result));

            java.lang.reflect.Method getDepartureTime = result.getClass().getMethod("departureTime");
            assertNotNull(getDepartureTime.invoke(result));
        }

        @Test
        void calculateTodaySummary_withOngoingBreak_includesBreakTime() throws Exception {
            // Arrange
            LocalDateTime clockInTime = LocalDateTime.now().minusHours(3);
            LocalDateTime breakStartTime = LocalDateTime.now().minusMinutes(15);

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(clockInTime);

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(breakStartTime);

            List<TimeRecord> records = Arrays.asList(clockIn, breakStart);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "calculateTodaySummary", List.class);
            method.setAccessible(true);
            Object result = method.invoke(timeRecordService, records);

            // Assert
            assertNotNull(result);
            java.lang.reflect.Method getStatus = result.getClass().getMethod("status");
            assertEquals("Break", getStatus.invoke(result));
        }
    }

    @Nested
    class formatDurationNoSecondsTests {

        @Test
        void formatDurationNoSeconds_withZeroDuration_returnsZeroTime() throws Exception {
            // Arrange
            Duration zeroDuration = Duration.ZERO;

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatDurationNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, zeroDuration);

            // Assert
            assertEquals("00:00", result);
        }

        @Test
        void formatDurationNoSeconds_withOneHour_returnsCorrectFormat() throws Exception {
            // Arrange
            Duration oneHour = Duration.ofHours(1);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatDurationNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, oneHour);

            // Assert
            assertEquals("01:00", result);
        }

        @Test
        void formatDurationNoSeconds_withHoursAndMinutes_returnsCorrectFormat() throws Exception {
            // Arrange
            Duration duration = Duration.ofHours(8).plusMinutes(30);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatDurationNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, duration);

            // Assert
            assertEquals("08:30", result);
        }

        @Test
        void formatDurationNoSeconds_withMoreThan24Hours_formatsCorrectly() throws Exception {
            // Arrange
            Duration duration = Duration.ofHours(25).plusMinutes(15);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatDurationNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, duration);

            // Assert
            assertEquals("25:15", result);
        }
    }

    @Nested
    class FormatFlexTimeTests {

        @Test
        void formatFlexTimeNoSeconds_withZeroDuration_returnsPositiveZero() throws Exception {
            // Arrange
            Duration zeroDuration = Duration.ZERO;

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatFlexTimeNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, zeroDuration);

            // Assert
            assertEquals("+00:00", result);
        }

        @Test
        void formatFlexTimeNoSeconds_withPositiveDuration_returnsWithPlusSign() throws Exception {
            // Arrange
            Duration positiveDuration = Duration.ofHours(2).plusMinutes(30);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatFlexTimeNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, positiveDuration);

            // Assert
            assertEquals("+02:30", result);
        }

        @Test
        void formatFlexTimeNoSeconds_withNegativeDuration_returnsWithMinusSign() throws Exception {
            // Arrange
            Duration negativeDuration = Duration.ofHours(-3).minusMinutes(15);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatFlexTimeNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, negativeDuration);

            // Assert
            assertEquals("-03:15", result);
        }

        @Test
        void formatFlexTimeNoSeconds_withNegativeOneHour_returnsCorrectFormat() throws Exception {
            // Arrange
            Duration negativeDuration = Duration.ofHours(-1);

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "formatFlexTimeNoSeconds", Duration.class);
            method.setAccessible(true);
            String result = (String) method.invoke(timeRecordService, negativeDuration);

            // Assert
            assertEquals("-01:00", result);
        }
    }

    @Nested
    class CreateTimeRecordHelperTests {

        @Test
        void createTimeRecord_withAllParameters_createsCorrectEntity() throws Exception {
            // Arrange
            LocalDate recordDate = LocalDate.now();
            LocalDateTime recordTime = LocalDateTime.now();
            String notes = "Test notes";

            // Act - Use reflection to call the private method
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "createTimeRecord",
                    Employee.class, LocalDate.class, LocalDateTime.class,
                    TimeRecord.RecordType.class, TimeRecord.LocationType.class,
                    String.class, boolean.class);
            method.setAccessible(true);
            TimeRecord result = (TimeRecord) method.invoke(
                    timeRecordService,
                    testEmployee, recordDate, recordTime,
                    TimeRecord.RecordType.CLOCK_IN, TimeRecord.LocationType.OFFICE,
                    notes, false);

            // Assert
            assertNotNull(result);
            assertEquals(testEmployee, result.getEmployee());
            assertEquals(recordDate, result.getRecordDate());
            assertEquals(recordTime, result.getRecordTime());
            assertEquals(TimeRecord.RecordType.CLOCK_IN, result.getRecordType());
            assertEquals(TimeRecord.LocationType.OFFICE, result.getLocationType());
            assertEquals(notes, result.getNotes());
            assertFalse(result.getIsManual());
            assertEquals(recordTime, result.getCreatedAt());
            assertEquals(recordTime, result.getUpdatedAt());
        }

        @Test
        void createTimeRecord_withManualFlag_setsCorrectly() throws Exception {
            // Arrange
            LocalDate recordDate = LocalDate.now();
            LocalDateTime recordTime = LocalDateTime.now();

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "createTimeRecord",
                    Employee.class, LocalDate.class, LocalDateTime.class,
                    TimeRecord.RecordType.class, TimeRecord.LocationType.class,
                    String.class, boolean.class);
            method.setAccessible(true);
            TimeRecord result = (TimeRecord) method.invoke(
                    timeRecordService,
                    testEmployee, recordDate, recordTime,
                    TimeRecord.RecordType.CLOCK_IN, TimeRecord.LocationType.HOME,
                    "Manual entry", true);

            // Assert
            assertTrue(result.getIsManual());
            assertEquals(TimeRecord.LocationType.HOME, result.getLocationType());
        }

        @Test
        void createTimeRecord_withBreakType_createsCorrectEntity() throws Exception {
            // Arrange
            LocalDate recordDate = LocalDate.now();
            LocalDateTime recordTime = LocalDateTime.now();

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "createTimeRecord",
                    Employee.class, LocalDate.class, LocalDateTime.class,
                    TimeRecord.RecordType.class, TimeRecord.LocationType.class,
                    String.class, boolean.class);
            method.setAccessible(true);
            TimeRecord result = (TimeRecord) method.invoke(
                    timeRecordService,
                    testEmployee, recordDate, recordTime,
                    TimeRecord.RecordType.BREAK_START, TimeRecord.LocationType.OFFICE,
                    "Break time", false);

            // Assert
            assertEquals(TimeRecord.RecordType.BREAK_START, result.getRecordType());
        }
    }

    @Nested
    class CanClockInTests {

        @Test
        void canClockIn_whenNotClockedIn_returnsTrue() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Collections.emptyList());

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canClockIn", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertTrue(result);
        }

        @Test
        void canClockIn_whenAlreadyClockedIn_returnsFalse() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canClockIn", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertFalse(result);
        }
    }

    @Nested
    class CanClockOutTests {

        @Test
        void canClockOut_whenClockedIn_returnsTrue() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canClockOut", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertTrue(result);
        }

        @Test
        void canClockOut_whenNotClockedIn_returnsFalse() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();
            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Collections.emptyList());

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canClockOut", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertFalse(result);
        }
    }

    @Nested
    class CanStartBreakTests {

        @Test
        void canStartBreak_whenWorkingAndNotOnBreak_returnsTrue() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canStartBreak", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertTrue(result);
        }

        @Test
        void canStartBreak_whenAlreadyOnBreak_returnsFalse() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(LocalDateTime.now().minusMinutes(30));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn, breakStart));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canStartBreak", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertFalse(result);
        }
    }

    @Nested
    class CanEndBreakTests {

        @Test
        void canEndBreak_whenOnBreak_returnsTrue() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            TimeRecord breakStart = new TimeRecord();
            breakStart.setRecordType(TimeRecord.RecordType.BREAK_START);
            breakStart.setRecordTime(LocalDateTime.now().minusMinutes(30));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn, breakStart));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canEndBreak", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertTrue(result);
        }

        @Test
        void canEndBreak_whenNotOnBreak_returnsFalse() throws Exception {
            // Arrange
            LocalDate today = LocalDate.now();

            TimeRecord clockIn = new TimeRecord();
            clockIn.setRecordType(TimeRecord.RecordType.CLOCK_IN);
            clockIn.setRecordTime(LocalDateTime.now().minusHours(2));

            when(timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeAsc(
                    testEmployee, today)).thenReturn(Arrays.asList(clockIn));

            // Act
            java.lang.reflect.Method method = TimeRecordService.class.getDeclaredMethod(
                    "canEndBreak", Employee.class, LocalDate.class);
            method.setAccessible(true);
            boolean result = (boolean) method.invoke(timeRecordService, testEmployee, today);

            // Assert
            assertFalse(result);
        }
    }
}