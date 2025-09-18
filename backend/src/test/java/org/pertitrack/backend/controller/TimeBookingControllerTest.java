package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.pertitrack.backend.dto.timeTrackingDto.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.pertitrack.backend.repository.*;
import org.pertitrack.backend.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.http.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.*;
import org.springframework.security.test.context.support.*;
import org.springframework.test.context.*;
import org.springframework.test.context.bean.override.mockito.*;
import org.springframework.test.web.servlet.*;

import java.time.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TimeBookingController.class)
@ActiveProfiles("test")
class TimeBookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private org.pertitrack.backend.security.JwtUtils jwtUtils;

    @MockitoBean
    private org.pertitrack.backend.security.UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TimeBookingService timeBookingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TimeBookingController timeBookingController;

    private TimeRecordResponse mockResponse;
    private TimeBookingController.QuickActionRequest mockRequest;
    private TimeBookingController.EnhancedQuickActionRequest mockEnhancedRequest;
    private final String BASE_URL = "/api/timetrack/time-records/time-bookings";

    @BeforeEach
    void setUp() {
        mockResponse = new TimeRecordResponse(
                "123", "0041", "John", "Doe", LocalDate.now(),
                LocalDateTime.now(), TimeRecord.RecordType.CLOCK_IN, TimeRecord.LocationType.OFFICE,
                "Test notes", false, LocalDateTime.now(), LocalDateTime.now()
        );
        mockRequest = new TimeBookingController.QuickActionRequest(
                TimeRecord.RecordType.CLOCK_IN, "Test notes"
        );
        mockEnhancedRequest = new TimeBookingController.EnhancedQuickActionRequest(
                TimeRecord.RecordType.CLOCK_IN, "Test notes", null
        );
    }

    // --- Nested tests for /clock-in endpoint ---
    @Nested
    @DisplayName("Quick Clock In Tests")
    class QuickClockInTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in is successful")
        void quickClockIn_Success_Returns201Created() throws Exception {
            // Arrange
            when(timeBookingService.quickClockIn(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(mockResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-in")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockEnhancedRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(mockResponse.id()))
                    .andExpect(jsonPath("$.employeeFirstName").value(mockResponse.employeeFirstName()))
                    .andExpect(jsonPath("$.recordType").value(mockResponse.recordType().toString()));

            // Verify service was called with correct parameters
            verify(timeBookingService, times(1))
                    .quickClockIn(eq(TimeRecord.RecordType.CLOCK_IN), eq("Test notes"));
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already clocked in")
        void quickClockIn_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeBookingService.quickClockIn(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Already clocked in"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-in")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockEnhancedRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeBookingService, times(1))
                    .quickClockIn(any(TimeRecord.RecordType.class), anyString());
        }
    }

    // --- Nested tests for /clock-out endpoint ---
    @Nested
    @DisplayName("Quick Clock Out Tests")
    class QuickClockOutTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK when clock out is successful")
        void quickClockOut_Success_Returns200Ok() throws Exception {
            // Arrange
            TimeRecordResponse clockOutResponse = mockResponse.withRecordType(TimeRecord.RecordType.CLOCK_OUT);
            when(timeBookingService.quickClockOut(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(clockOutResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-out")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(clockOutResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("CLOCK_OUT"));

            verify(timeBookingService, times(1))
                    .quickClockOut(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when not clocked in")
        void quickClockOut_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeBookingService.quickClockOut(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Not clocked in"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-out")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeBookingService, times(1))
                    .quickClockOut(any(TimeRecord.RecordType.class), anyString());
        }
    }

    // --- Nested tests for /break-start endpoint ---
    @Nested
    @DisplayName("Quick Break Start Tests")
    class QuickBreakStartTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK when break start is successful")
        void quickBreakStart_Success_Returns200Ok() throws Exception {
            // Arrange
            TimeRecordResponse breakStartResponse = mockResponse.withRecordType(TimeRecord.RecordType.BREAK_START);
            when(timeBookingService.quickBreakStart(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(breakStartResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-start")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(breakStartResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("BREAK_START"));

            verify(timeBookingService, times(1))
                    .quickBreakStart(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already on break")
        void quickBreakStart_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeBookingService.quickBreakStart(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Already on break"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-start")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeBookingService, times(1))
                    .quickBreakStart(any(TimeRecord.RecordType.class), anyString());
        }
    }

    // --- Nested tests for /break-end endpoint ---
    @Nested
    @DisplayName("Quick Break End Tests")
    class QuickBreakEndTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK when break end is successful")
        void quickBreakEnd_Success_Returns200Ok() throws Exception {
            // Arrange
            TimeRecordResponse breakEndResponse = mockResponse.withRecordType(TimeRecord.RecordType.BREAK_END);
            when(timeBookingService.quickBreakEnd(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(breakEndResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-end")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(breakEndResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("BREAK_END"));

            verify(timeBookingService, times(1))
                    .quickBreakEnd(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when not on break")
        void quickBreakEnd_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeBookingService.quickBreakEnd(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Not on break"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-end")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeBookingService, times(1))
                    .quickBreakEnd(any(TimeRecord.RecordType.class), anyString());
        }
    }
}