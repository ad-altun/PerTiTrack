package org.pertitrack.backend.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.*;
import org.mockito.*;
import org.mockito.junit.jupiter.*;
import org.pertitrack.backend.dto.timeTrackingDto.*;
import org.pertitrack.backend.entity.auth.*;
import org.pertitrack.backend.entity.personnel.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.pertitrack.backend.exceptions.*;
import org.pertitrack.backend.mapper.*;
import org.pertitrack.backend.repository.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.*;
import org.springframework.test.context.*;
import org.springframework.test.util.*;

import java.time.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class TimeBookingServiceTest {

    @InjectMocks
    private TimeBookingService timeBookingService;

    @Mock
    private TimeRecordRepository timeRecordRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private TimeRecordMapper timeRecordMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User testUser;
    private Employee testEmployee;
    private LocalDateTime now;
    private LocalDate today;
    private String userEmail = "testuser@pertitrack.org";
    private String userId = "user123";
    private String employeeId = "emp456";

    @BeforeEach
    void setUp() {
        // Set up mocks for SecurityContextHolder to simulate authenticated user
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(userEmail);

        // Common test data
        testUser = new User();
        ReflectionTestUtils.setField(testUser, "id", userId);
        testUser.setEmail(userEmail);

        testEmployee = new Employee();
        ReflectionTestUtils.setField(testEmployee, "id", employeeId);
        testEmployee.setUser(testUser);

        now = LocalDateTime.now();
        today = now.toLocalDate();
    }

    private void mockCurrentUserAndEmployee() {
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.of(testEmployee));
    }

    // --- Nested tests for quickClockIn ---
    @Nested
    class QuickClockInTests {

        @Test
        void quickClockIn_Success_NoPreviousRecord() {
            // Arrange
            mockCurrentUserAndEmployee();
            String notes = "Morning clock-in";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse = new TimeRecordResponse("tr1", employeeId, "FN", "LN", today, now, TimeRecord.RecordType.CLOCK_IN, TimeRecord.LocationType.OFFICE, notes, false, now, now);

            // Mock that employee is not already clocked in (no CLOCK_IN record)
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.empty());
            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeBookingService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, notes);

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
            // Mock that employee is already clocked in (has CLOCK_IN, no CLOCK_OUT)
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordTime(now.minusHours(2));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.of(clockInRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_OUT))
                    .thenReturn(Optional.empty());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeBookingService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, ""));
            assertEquals("Employee is already clocked in.Please clock out first.", thrown.getMessage());
            verify(timeRecordRepository, never()).save(any(TimeRecord.class));
        }

        @Test
        void quickClockIn_ThrowsException_EmployeeNotFound() {
            // Arrange
            when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
            when(employeeRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EmployeeNotFoundException.class,
                    () -> timeBookingService.quickClockIn(TimeRecord.RecordType.CLOCK_IN, ""));
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
            clockInRecord.setRecordTime(now.minusHours(8)); // Clocked in 8 hours ago
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.of(clockInRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_OUT))
                    .thenReturn(Optional.empty());
            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeBookingService.quickClockOut(TimeRecord.RecordType.CLOCK_OUT, notes);

            // Assert
            assertNotNull(response);
            assertEquals(expectedResponse, response);
            verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        }

        @Test
        void quickClockOut_ThrowsException_NotClockedIn() {
            // Arrange
            mockCurrentUserAndEmployee();
            // Mock that employee is not clocked in (no CLOCK_IN record)
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.empty());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeBookingService.quickClockOut(TimeRecord.RecordType.CLOCK_OUT, ""));
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
            String notes = "Lunch break";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse =
                    new TimeRecordResponse("tr3", employeeId, "FN", "LN",
                            today, now, TimeRecord.RecordType.BREAK_START,
                            TimeRecord.LocationType.OFFICE, notes, false, now, now);

            // Mock that employee is clocked in (has CLOCK_IN, no CLOCK_OUT)
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordTime(now.minusHours(2)); // Clocked in 2 hours ago
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.of(clockInRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_OUT))
                    .thenReturn(Optional.empty());

            // Mock that employee is not already on break
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_START))
                    .thenReturn(Optional.empty());
            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeBookingService.quickBreakStart(
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
            // Mock that employee is not clocked in (no CLOCK_IN record)
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.empty());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeBookingService.quickBreakStart(TimeRecord.RecordType.BREAK_START, ""));
            assertEquals("Employee must be clocked in to start break.", thrown.getMessage());
        }

        @Test
        void quickBreakStart_ThrowsException_AlreadyOnBreak() {
            // Arrange
            mockCurrentUserAndEmployee();
            // Mock that employee is clocked in
            TimeRecord clockInRecord = new TimeRecord();
            clockInRecord.setRecordTime(now.minusHours(2));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_IN))
                    .thenReturn(Optional.of(clockInRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.CLOCK_OUT))
                    .thenReturn(Optional.empty());

            // Mock that employee is already on break (has BREAK_START, no BREAK_END)
            TimeRecord breakStartRecord = new TimeRecord();
            breakStartRecord.setRecordTime(now.minusMinutes(30));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_START))
                    .thenReturn(Optional.of(breakStartRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_END))
                    .thenReturn(Optional.empty());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeBookingService.quickBreakStart(TimeRecord.RecordType.BREAK_START, ""));
            assertEquals("Employee is already on break.", thrown.getMessage());
        }
    }

    // --- Nested tests for quickBreakEnd ---
    @Nested
    class QuickBreakEndTests {

        @Test
        void quickBreakEnd_Success() {
            // Arrange
            mockCurrentUserAndEmployee();
            String notes = "Back from lunch";
            TimeRecord savedTimeRecord = new TimeRecord();
            TimeRecordResponse expectedResponse = new TimeRecordResponse("tr4", employeeId, "FN", "LN", today, now, TimeRecord.RecordType.BREAK_END, TimeRecord.LocationType.OFFICE, notes, false, now, now);

            // Mock that employee is on break (has BREAK_START, no BREAK_END)
            TimeRecord breakStartRecord = new TimeRecord();
            breakStartRecord.setRecordTime(now.minusMinutes(30));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_START))
                    .thenReturn(Optional.of(breakStartRecord));
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_END))
                    .thenReturn(Optional.empty());
            when(timeRecordRepository.save(any(TimeRecord.class))).thenReturn(savedTimeRecord);
            when(timeRecordMapper.toResponse(any(TimeRecord.class))).thenReturn(expectedResponse);

            // Act
            TimeRecordResponse response = timeBookingService.quickBreakEnd(TimeRecord.RecordType.BREAK_END, notes);

            // Assert
            assertNotNull(response);
            assertEquals(expectedResponse, response);
            verify(timeRecordRepository, times(1)).save(any(TimeRecord.class));
        }

        @Test
        void quickBreakEnd_ThrowsException_NotOnBreak() {
            // Arrange
            mockCurrentUserAndEmployee();
            when(timeRecordRepository.findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                    testEmployee, today, TimeRecord.RecordType.BREAK_START))
                    .thenReturn(Optional.empty());

            // Act & Assert
            IllegalStateException thrown = assertThrows(IllegalStateException.class,
                    () -> timeBookingService.quickBreakEnd(TimeRecord.RecordType.BREAK_END, ""));
            assertEquals("Employee is not on break. " +
                    "Cannot end break.", thrown.getMessage());
        }
    }
}