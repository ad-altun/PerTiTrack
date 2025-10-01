package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.pertitrack.backend.controller.TimeBookingController.LocationClockInRequest;
import org.pertitrack.backend.controller.TimeBookingController.UpdateNotesRequest;
import org.pertitrack.backend.dto.timeTrackingDto.CurrentStatusResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TodaySummaryResponse;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EntityNotFoundException;
import org.pertitrack.backend.service.TimeRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    private TimeRecordService timeRecordService;

    @Autowired
    private ObjectMapper objectMapper;

    private TimeRecordResponse mockResponse;
    private TimeBookingController.QuickActionRequest mockRequest;
    private TimeBookingController.EnhancedQuickActionRequest mockEnhancedRequest;
    private final String BASE_URL = "/api/timetrack/time-records/time-bookings";

    private TimeRecordResponse mockTimeRecordResponse;
    private CurrentStatusResponse mockCurrentStatusResponse;
    private TodaySummaryResponse mockTodaySummaryResponse;

    @BeforeEach
    void setUp() {
        mockTimeRecordResponse = new TimeRecordResponse(
                "550e8400-e29b-41d4-a716-446655440000",
                "0041",
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

        mockResponse = new TimeRecordResponse(
                "550e8400-e29b-41d4-a716-446655440000",
                "0041",
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

        mockRequest = new TimeBookingController.QuickActionRequest(
                TimeRecord.RecordType.CLOCK_IN, "Test notes"
        );
        mockEnhancedRequest = new TimeBookingController.EnhancedQuickActionRequest(
                TimeRecord.RecordType.CLOCK_IN, "Test notes", null
        );

        mockCurrentStatusResponse = new CurrentStatusResponse(
                true,
                false,
                "OFFICE",
                mockTimeRecordResponse
        );

        mockTodaySummaryResponse = new TodaySummaryResponse(
                "08:00:00",
                "17:00:00",
                "01:00:00",
                "08:00:00",
                "00:00:00",
                "Working",
                true,
                false
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
            when(timeRecordService.quickClockIn(any(TimeRecord.RecordType.class), anyString()))
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
            verify(timeRecordService, times(1))
                    .quickClockIn(eq(TimeRecord.RecordType.CLOCK_IN), eq("Test notes"));
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already clocked in")
        void quickClockIn_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeRecordService.quickClockIn(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Already clocked in"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-in")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockEnhancedRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeRecordService, times(1))
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
            when(timeRecordService.quickClockOut(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(clockOutResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-out")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(clockOutResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("CLOCK_OUT"));

            verify(timeRecordService, times(1))
                    .quickClockOut(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when not clocked in")
        void quickClockOut_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeRecordService.quickClockOut(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Not clocked in"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/clock-out")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeRecordService, times(1))
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
            when(timeRecordService.quickBreakStart(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(breakStartResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-start")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(breakStartResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("BREAK_START"));

            verify(timeRecordService, times(1))
                    .quickBreakStart(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already on break")
        void quickBreakStart_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeRecordService.quickBreakStart(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Already on break"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-start")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeRecordService, times(1))
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
            when(timeRecordService.quickBreakEnd(any(TimeRecord.RecordType.class), anyString()))
                    .thenReturn(breakEndResponse);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-end")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(breakEndResponse.id()))
                    .andExpect(jsonPath("$.recordType").value("BREAK_END"));

            verify(timeRecordService, times(1))
                    .quickBreakEnd(any(TimeRecord.RecordType.class), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when not on break")
        void quickBreakEnd_Failure_Returns400BadRequest() throws Exception {
            // Arrange
            when(timeRecordService.quickBreakEnd(any(TimeRecord.RecordType.class), anyString()))
                    .thenThrow(new IllegalStateException("Not on break"));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/break-end")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(mockRequest)))
                    .andExpect(status().isBadRequest());

            verify(timeRecordService, times(1))
                    .quickBreakEnd(any(TimeRecord.RecordType.class), anyString());
        }
    }

    @Nested
    @DisplayName("Clock In Home Tests")
    class ClockInHomeTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in home is successful with notes")
        void clockInHome_withNotes_returnsCreated() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Working from home today");
            TimeRecordResponse homeResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.HOME)
                    .withNotes("Working from home today");

            when(timeRecordService.clockInHome("Working from home today")).thenReturn(homeResponse);

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/home")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(homeResponse.id()))
                    .andExpect(jsonPath("$.locationType").value("HOME"))
                    .andExpect(jsonPath("$.notes").value("Working from home today"))
                    .andExpect(jsonPath("$.recordType").value("CLOCK_IN"));

            verify(timeRecordService, times(1)).clockInHome("Working from home today");
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in home is successful without notes")
        void clockInHome_withoutNotes_returnsCreated() throws Exception {
            // Arrange
            TimeRecordResponse homeResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.HOME)
                    .withNotes(null);

            when(timeRecordService.clockInHome(null)).thenReturn(homeResponse);

            // Act & Assert - empty request body
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/home")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.locationType").value("HOME"));

            verify(timeRecordService, times(1)).clockInHome(null);
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in home with null request body")
        void clockInHome_withNullRequestBody_returnsCreated() throws Exception {
            // Arrange
            TimeRecordResponse homeResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.HOME);

            when(timeRecordService.clockInHome(null)).thenReturn(homeResponse);

            // Act & Assert - no request body
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/home")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());

            verify(timeRecordService, times(1)).clockInHome(null);
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already clocked in")
        void clockInHome_whenAlreadyClockedIn_returnsBadRequest() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Working from home");
            when(timeRecordService.clockInHome(anyString()))
                    .thenThrow(new IllegalStateException("Already clocked in"));

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/home")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(header().string("X-Error-Message", "Already clocked in"));

            verify(timeRecordService, times(1)).clockInHome(anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on unexpected exception")
        void clockInHome_onUnexpectedException_returnsInternalServerError() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Test");
            when(timeRecordService.clockInHome(anyString()))
                    .thenThrow(new RuntimeException("Database error"));

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/home")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(header().string("X-Error-Message", "An unexpected error occurred"));
        }
    }

    @Nested
    @DisplayName("Clock In Business Trip Tests")
    class ClockInBusinessTripTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in business trip is successful with notes")
        void clockInBusinessTrip_withNotes_returnsCreated() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Meeting with client");
            TimeRecordResponse businessTripResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.BUSINESS_TRIP)
                    .withNotes("Meeting with client");

            when(timeRecordService.clockInBusinessTrip("Meeting with client"))
                    .thenReturn(businessTripResponse);

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/business-trip")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(businessTripResponse.id()))
                    .andExpect(jsonPath("$.locationType").value("BUSINESS_TRIP"))
                    .andExpect(jsonPath("$.notes").value("Meeting with client"))
                    .andExpect(jsonPath("$.recordType").value("CLOCK_IN"));

            verify(timeRecordService, times(1)).clockInBusinessTrip("Meeting with client");
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in business trip without notes")
        void clockInBusinessTrip_withoutNotes_returnsCreated() throws Exception {
            // Arrange
            TimeRecordResponse businessTripResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.BUSINESS_TRIP)
                    .withNotes(null);

            when(timeRecordService.clockInBusinessTrip(null)).thenReturn(businessTripResponse);

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/business-trip")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.locationType").value("BUSINESS_TRIP"));

            verify(timeRecordService, times(1)).clockInBusinessTrip(null);
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 201 Created when clock in business trip with null request body")
        void clockInBusinessTrip_withNullRequestBody_returnsCreated() throws Exception {
            // Arrange
            TimeRecordResponse businessTripResponse = mockTimeRecordResponse
                    .withLocationType(TimeRecord.LocationType.BUSINESS_TRIP);

            when(timeRecordService.clockInBusinessTrip(null)).thenReturn(businessTripResponse);

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/business-trip")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());

            verify(timeRecordService, times(1)).clockInBusinessTrip(null);
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 400 Bad Request when already clocked in")
        void clockInBusinessTrip_whenAlreadyClockedIn_returnsBadRequest() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Business trip");
            when(timeRecordService.clockInBusinessTrip(anyString()))
                    .thenThrow(new IllegalStateException("Already clocked in"));

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/business-trip")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(header().string("X-Error-Message", "Already clocked in"));

            verify(timeRecordService, times(1)).clockInBusinessTrip(anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on unexpected exception")
        void clockInBusinessTrip_onUnexpectedException_returnsInternalServerError() throws Exception {
            // Arrange
            LocationClockInRequest request = new LocationClockInRequest("Test");
            when(timeRecordService.clockInBusinessTrip(anyString()))
                    .thenThrow(new RuntimeException("Database error"));

            // Act & Assert
            mockMvc.perform(post("/api/timetrack/time-records/time-bookings/clock-in/business-trip")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(header().string("X-Error-Message", "An unexpected error occurred"));
        }
    }

    @Nested
    @DisplayName("Get Current Status Tests")
    class GetCurrentStatusTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with current status when user is working")
        void getCurrentStatus_whenWorking_returnsOk() throws Exception {
            // Arrange
            when(timeRecordService.getCurrentStatus()).thenReturn(mockCurrentStatusResponse);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/status/current")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isWorking").value(true))
                    .andExpect(jsonPath("$.isOnBreak").value(false))
                    .andExpect(jsonPath("$.currentLocation").value("OFFICE"))
                    .andExpect(jsonPath("$.lastEntry").exists())
                    .andExpect(jsonPath("$.lastEntry.id").value(mockTimeRecordResponse.id()));

            verify(timeRecordService, times(1)).getCurrentStatus();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with current status when user is on break")
        void getCurrentStatus_whenOnBreak_returnsOk() throws Exception {
            // Arrange
            CurrentStatusResponse onBreakStatus = new CurrentStatusResponse(
                    true, true, "OFFICE", mockTimeRecordResponse
            );
            when(timeRecordService.getCurrentStatus()).thenReturn(onBreakStatus);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/status/current")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isWorking").value(true))
                    .andExpect(jsonPath("$.isOnBreak").value(true))
                    .andExpect(jsonPath("$.currentLocation").value("OFFICE"));

            verify(timeRecordService, times(1)).getCurrentStatus();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with current status when user is not working")
        void getCurrentStatus_whenNotWorking_returnsOk() throws Exception {
            // Arrange
            CurrentStatusResponse notWorkingStatus = new CurrentStatusResponse(
                    false, false, null, null
            );
            when(timeRecordService.getCurrentStatus()).thenReturn(notWorkingStatus);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/status/current")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isWorking").value(false))
                    .andExpect(jsonPath("$.isOnBreak").value(false))
                    .andExpect(jsonPath("$.currentLocation").doesNotExist())
                    .andExpect(jsonPath("$.lastEntry").doesNotExist());

            verify(timeRecordService, times(1)).getCurrentStatus();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on exception")
        void getCurrentStatus_onException_returnsInternalServerError() throws Exception {
            // Arrange
            when(timeRecordService.getCurrentStatus())
                    .thenThrow(new RuntimeException("Service error"));

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/status/current")
                            .with(csrf()))
                    .andExpect(status().isInternalServerError());

            verify(timeRecordService, times(1)).getCurrentStatus();
        }
    }

    @Nested
    @DisplayName("Get Today Time Records Tests")
    class GetTodayTimeRecordsTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with list of time records")
        void getTodayTimeRecords_withRecords_returnsOk() throws Exception {
            // Arrange
            TimeRecordResponse record1 = mockTimeRecordResponse;
            TimeRecordResponse record2 = mockTimeRecordResponse
                    .withId("550e8400-e29b-41d4-a716-446655440001")
                    .withRecordType(TimeRecord.RecordType.CLOCK_OUT);

            List<TimeRecordResponse> records = Arrays.asList(record1, record2);
            when(timeRecordService.getTodayTimeRecords()).thenReturn(records);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/time-records/today")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].id").value(record1.id()))
                    .andExpect(jsonPath("$[0].recordType").value("CLOCK_IN"))
                    .andExpect(jsonPath("$[1].id").value(record2.id()))
                    .andExpect(jsonPath("$[1].recordType").value("CLOCK_OUT"));

            verify(timeRecordService, times(1)).getTodayTimeRecords();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with empty list when no records")
        void getTodayTimeRecords_withNoRecords_returnsEmptyList() throws Exception {
            // Arrange
            when(timeRecordService.getTodayTimeRecords()).thenReturn(Collections.emptyList());

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/time-records/today")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(timeRecordService, times(1)).getTodayTimeRecords();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on exception")
        void getTodayTimeRecords_onException_returnsInternalServerError() throws Exception {
            // Arrange
            when(timeRecordService.getTodayTimeRecords())
                    .thenThrow(new RuntimeException("Service error"));

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/time-records/today")
                            .with(csrf()))
                    .andExpect(status().isInternalServerError());

            verify(timeRecordService, times(1)).getTodayTimeRecords();
        }
    }

    @Nested
    @DisplayName("Get Today Summary Tests")
    class GetTodaySummaryTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with today's summary")
        void getTodaySummary_returnsOk() throws Exception {
            // Arrange
            when(timeRecordService.getTodaySummary()).thenReturn(mockTodaySummaryResponse);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/summary/today")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.arrivalTime").value("08:00:00"))
                    .andExpect(jsonPath("$.departureTime").value("17:00:00"))
                    .andExpect(jsonPath("$.breakTime").value("01:00:00"))
                    .andExpect(jsonPath("$.workingTime").value("08:00:00"))
                    .andExpect(jsonPath("$.flexTime").value("00:00:00"))
                    .andExpect(jsonPath("$.status").value("Working"))
                    .andExpect(jsonPath("$.isWorking").value(true))
                    .andExpect(jsonPath("$.isOnBreak").value(false));

            verify(timeRecordService, times(1)).getTodaySummary();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK with summary when user hasn't clocked in")
        void getTodaySummary_whenNotClockedIn_returnsOk() throws Exception {
            // Arrange
            TodaySummaryResponse emptySummary = new TodaySummaryResponse(
                    null, null, "00:00:00", "00:00:00", "00:00:00", "Not Working", false, false
            );
            when(timeRecordService.getTodaySummary()).thenReturn(emptySummary);

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/summary/today")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.isWorking").value(false))
                    .andExpect(jsonPath("$.isOnBreak").value(false))
                    .andExpect(jsonPath("$.status").value("Not Working"));

            verify(timeRecordService, times(1)).getTodaySummary();
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on exception")
        void getTodaySummary_onException_returnsInternalServerError() throws Exception {
            // Arrange
            when(timeRecordService.getTodaySummary())
                    .thenThrow(new RuntimeException("Service error"));

            // Act & Assert
            mockMvc.perform(get("/api/timetrack/summary/today")
                            .with(csrf()))
                    .andExpect(status().isInternalServerError());

            verify(timeRecordService, times(1)).getTodaySummary();
        }
    }

    @Nested
    @DisplayName("Update Time Record Notes Tests")
    class UpdateTimeRecordNotesTests {

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK when notes are updated successfully")
        void updateTimeRecordNotes_success_returnsOk() throws Exception {
            // Arrange
            String recordId = "550e8400-e29b-41d4-a716-446655440000";
            UpdateNotesRequest request = new UpdateNotesRequest("Updated notes");
            TimeRecordResponse updatedResponse = mockTimeRecordResponse.withNotes("Updated notes");

            when(timeRecordService.updateTimeRecordNotes(recordId, "Updated notes"))
                    .thenReturn(updatedResponse);

            // Act & Assert
            mockMvc.perform(patch("/api/timetrack/time-records/{id}/notes", recordId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(recordId))
                    .andExpect(jsonPath("$.notes").value("Updated notes"));

            verify(timeRecordService, times(1)).updateTimeRecordNotes(recordId, "Updated notes");
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 200 OK when notes are cleared")
        void updateTimeRecordNotes_clearNotes_returnsOk() throws Exception {
            // Arrange
            String recordId = "550e8400-e29b-41d4-a716-446655440000";
            UpdateNotesRequest request = new UpdateNotesRequest(null);
            TimeRecordResponse updatedResponse = mockTimeRecordResponse.withNotes(null);

            when(timeRecordService.updateTimeRecordNotes(recordId, null))
                    .thenReturn(updatedResponse);

            // Act & Assert
            mockMvc.perform(patch("/api/timetrack/time-records/{id}/notes", recordId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(recordId))
                    .andExpect(jsonPath("$.notes").isEmpty());

            verify(timeRecordService, times(1)).updateTimeRecordNotes(recordId, null);
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 404 Not Found when record does not exist")
        void updateTimeRecordNotes_recordNotFound_returnsNotFound() throws Exception {
            // Arrange
            String recordId = "non-existent-id";
            UpdateNotesRequest request = new UpdateNotesRequest("Notes");

            when(timeRecordService.updateTimeRecordNotes(recordId, "Notes"))
                    .thenThrow(new EntityNotFoundException("TimeRecord"));

            // Act & Assert
            mockMvc.perform(patch("/api/timetrack/time-records/{id}/notes", recordId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(header().exists("X-Error-Message"));

            verify(timeRecordService, times(1)).updateTimeRecordNotes(eq(recordId), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 403 Forbidden when user doesn't have permission")
        void updateTimeRecordNotes_noPermission_returnsForbidden() throws Exception {
            // Arrange
            String recordId = "550e8400-e29b-41d4-a716-446655440000";
            UpdateNotesRequest request = new UpdateNotesRequest("Notes");

            when(timeRecordService.updateTimeRecordNotes(recordId, "Notes"))
                    .thenThrow(new SecurityException("Access denied"));

            // Act & Assert
            mockMvc.perform(patch("/api/timetrack/time-records/{id}/notes", recordId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden())
                    .andExpect(header().string("X-Error-Message", "Access denied"));

            verify(timeRecordService, times(1)).updateTimeRecordNotes(eq(recordId), anyString());
        }

        @Test
        @WithMockUser
        @DisplayName("Should return 500 Internal Server Error on unexpected exception")
        void updateTimeRecordNotes_unexpectedException_returnsInternalServerError() throws Exception {
            // Arrange
            String recordId = "550e8400-e29b-41d4-a716-446655440000";
            UpdateNotesRequest request = new UpdateNotesRequest("Notes");

            when(timeRecordService.updateTimeRecordNotes(recordId, "Notes"))
                    .thenThrow(new RuntimeException("Database error"));

            // Act & Assert
            mockMvc.perform(patch("/api/timetrack/time-records/{id}/notes", recordId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(header().string("X-Error-Message", "An unexpected error occurred"));

            verify(timeRecordService, times(1)).updateTimeRecordNotes(eq(recordId), anyString());
        }
    }
}