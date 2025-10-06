package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.*;
import org.mockito.junit.jupiter.*;
import org.pertitrack.backend.dto.timeTrackingDto.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.pertitrack.backend.exceptions.*;
import org.pertitrack.backend.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.*;
import org.springframework.test.context.*;
import org.springframework.test.context.bean.override.mockito.*;
import org.springframework.test.web.servlet.*;

import java.time.*;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(TimeRecordController.class)
@ActiveProfiles("test")
class TimeRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TimeRecordService timeRecordService;

    @MockitoBean
    private org.pertitrack.backend.security.JwtUtils jwtUtils;

    @MockitoBean
    private org.pertitrack.backend.security.UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String BASE_URL = "/api/timetrack/time-records";

    @Test
    @WithMockUser
    void getMyTimeRecords_Success_WithAllParameters() throws Exception {
        // Arrange
        List<TimeRecordResponse> timeRecords = Arrays.asList(
                createTimeRecordResponse("1", "emp1"),
                createTimeRecordResponse("2", "emp2")
        );
        LocalDate startDate = LocalDate.of(2023, 1, 1);
        LocalDate endDate = LocalDate.of(2023, 1, 31);
        String recordType = "CLOCK_IN";
        when(timeRecordService.getMyTimeRecords(startDate, endDate, TimeRecord.RecordType.CLOCK_IN))
                .thenReturn(timeRecords);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/my-records")
                        .param("startDate", "2023-01-01")
                        .param("endDate", "2023-01-31")
                        .param("recordType", recordType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].recordType").value(recordType));
    }

    @Test
    @WithMockUser
    void getMyTodayRecords_Success_Returns200Ok() throws Exception {
        // Arrange
        List<TimeRecordResponse> timeRecords = Arrays.asList(
                createTimeRecordResponse("1", "emp1"),
                createTimeRecordResponse("2", "emp2")
        );
        when(timeRecordService.getMyTodayRecords()).thenReturn(timeRecords);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/my-records/today"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getMyTodayRecords_EmptyList_Returns200Ok() throws Exception {
        // Arrange

        when(timeRecordService.getMyTodayRecords()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/my-records/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @WithMockUser
    void getAllTimeRecords_ShouldReturnListOfTimeRecords() throws Exception {
        // Given
        List<TimeRecordResponse> timeRecords = Arrays.asList(
                createTimeRecordResponse("1", "emp1"),
                createTimeRecordResponse("2", "emp2")
        );
        when(timeRecordService.getAllTimeRecords()).thenReturn(timeRecords);

        // When & Then
        mockMvc.perform(get("/api/timetrack/time-records"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[1].id").value("2"));

        verify(timeRecordService).getAllTimeRecords();
    }

    @Test
    @WithMockUser
    void getTimeRecordById_WhenExists_ShouldReturnTimeRecord() throws Exception {
        // Given
        String timeRecordId = "1";
        TimeRecordResponse timeRecord = createTimeRecordResponse(timeRecordId, "emp1");
        when(timeRecordService.getTimeRecordById(timeRecordId)).thenReturn(timeRecord);

        // When & Then
        mockMvc.perform(get("/api/timetrack/time-records/{id}", timeRecordId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(timeRecordId))
                .andExpect(jsonPath("$.employeeId").value("emp1"));

        verify(timeRecordService).getTimeRecordById(timeRecordId);
    }

    @Test
    @WithMockUser
    void getTimeRecordById_WhenNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        String timeRecordId = "999";
        when(timeRecordService.getTimeRecordById(timeRecordId))
                .thenThrow(new TimeRecordNotFoundException("Time record not found: ", timeRecordId));

        // When & Then
        mockMvc.perform(get("/api/timetrack/time-records/{id}", timeRecordId))
                .andExpect(status().isNotFound());

        verify(timeRecordService).getTimeRecordById(timeRecordId);
    }

    @Test
    @WithMockUser
    void getTimeRecordsByEmployeeId_ShouldReturnEmployeeTimeRecords() throws Exception {
        // Given
        String employeeId = "emp1";
        List<TimeRecordResponse> timeRecords = Arrays.asList(
                createTimeRecordResponse("1", employeeId),
                createTimeRecordResponse("2", employeeId)
        );
        when(timeRecordService.getTimeRecordsByEmployeeId(employeeId)).thenReturn(timeRecords);

        // When & Then
        mockMvc.perform(get("/api/timetrack/time-records/employee/{employeeId}", employeeId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].employeeId").value(employeeId))
                .andExpect(jsonPath("$[1].employeeId").value(employeeId));

        verify(timeRecordService).getTimeRecordsByEmployeeId(employeeId);
    }

    @Test
    @WithMockUser
    void createTimeRecord_WithValidRequest_ShouldCreateAndReturnTimeRecord() throws Exception {
        // Given
        TimeRecordRequest request = new TimeRecordRequest(
                "emp1",
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Morning clock in",
                false
        );
        TimeRecordResponse response = createTimeRecordResponse("1", "emp1");
        when(timeRecordService.createTimeRecord(any(TimeRecordRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.employeeId").value("emp1"));

        verify(timeRecordService).createTimeRecord(any(TimeRecordRequest.class));
    }

    @Test
    @WithMockUser
    void createTimeRecord_WithInvalidEmployeeId_ShouldReturnBadRequest() throws Exception {
        // Given
        TimeRecordRequest request = new TimeRecordRequest(
                "invalid-emp",
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Morning clock in",
                false
        );
        when(timeRecordService.createTimeRecord(any(TimeRecordRequest.class)))
                .thenThrow(new EmployeeNotFoundException("Employee not found: ", "invalid-emp"));

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(timeRecordService).createTimeRecord(any(TimeRecordRequest.class));
    }

    @Test
    @WithMockUser
    void updateTimeRecord_WithValidRequest_ShouldUpdateAndReturnTimeRecord() throws Exception {
        // Given
        String timeRecordId = "1";
        TimeRecordUpdateRequest request = new TimeRecordUpdateRequest(
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 17, 30),
                TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.HOME,
                "Updated clock out",
                true
        );
        TimeRecordResponse response = createTimeRecordResponse(timeRecordId, "emp1");
        when(timeRecordService.updateTimeRecord(eq(timeRecordId), any(TimeRecordUpdateRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/timetrack/time-records/{id}", timeRecordId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(timeRecordId));

        verify(timeRecordService).updateTimeRecord(eq(timeRecordId), any(TimeRecordUpdateRequest.class));
    }

    @Test
    @WithMockUser
    void updateTimeRecord_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        String timeRecordId = "999";
        TimeRecordUpdateRequest request = new TimeRecordUpdateRequest(
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 17, 30),
                TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.HOME,
                "Updated clock out",
                true
        );
        when(timeRecordService.updateTimeRecord(eq(timeRecordId), any(TimeRecordUpdateRequest.class)))
                .thenThrow(new TimeRecordNotFoundException("Time record not found: ", timeRecordId));

        // When & Then
        mockMvc.perform(put("/api/timetrack/time-records/{id}", timeRecordId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());

        verify(timeRecordService).updateTimeRecord(eq(timeRecordId), any(TimeRecordUpdateRequest.class));
    }

    @Test
    @WithMockUser
    void deleteTimeRecord_WithValidId_ShouldDeleteAndReturnSuccessMessage() throws Exception {
        // Given
        String timeRecordId = "1";
        doNothing().when(timeRecordService).deleteTimeRecord(timeRecordId);

        // When & Then
        mockMvc.perform(delete("/api/timetrack/time-records/{id}", timeRecordId)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Time record deleted successfully"));

        verify(timeRecordService).deleteTimeRecord(timeRecordId);
    }

    @Test
    @WithMockUser
    void deleteTimeRecord_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        String timeRecordId = "999";
        doThrow(new TimeRecordNotFoundException("Time record not found: ", timeRecordId))
                .when(timeRecordService).deleteTimeRecord(timeRecordId);

        // When & Then
        mockMvc.perform(delete("/api/timetrack/time-records/{id}", timeRecordId)
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(timeRecordService).deleteTimeRecord(timeRecordId);
    }

    // Add these test methods to TimeRecordControllerTest.java

    @Test
    @WithMockUser
    void createTimeRecords_WithValidRequests_ShouldCreateAndReturnAllRecords() throws Exception {
        // Given
        List<TimeRecordRequest> requests = Arrays.asList(
                new TimeRecordRequest(
                        "emp1",
                        LocalDate.of(2024, 1, 15),
                        LocalDateTime.of(2024, 1, 15, 9, 0),
                        TimeRecord.RecordType.CLOCK_IN,
                        TimeRecord.LocationType.OFFICE,
                        "Morning clock in",
                        false
                ),
                new TimeRecordRequest(
                        "emp1",
                        LocalDate.of(2024, 1, 15),
                        LocalDateTime.of(2024, 1, 15, 12, 0),
                        TimeRecord.RecordType.BREAK_START,
                        TimeRecord.LocationType.OFFICE,
                        "Lunch break",
                        false
                )
        );

        List<TimeRecordResponse> responses = Arrays.asList(
                createTimeRecordResponse("1", "emp1"),
                createTimeRecordResponse("2", "emp1")
        );

        when(timeRecordService.createTimeRecords(anyList())).thenReturn(responses);

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records/batch")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[1].id").value("2"));

        verify(timeRecordService).createTimeRecords(anyList());
    }

    @Test
    @WithMockUser
    void createTimeRecords_WithEmptyList_ShouldReturnEmptyList() throws Exception {
        // Given
        List<TimeRecordRequest> requests = Collections.emptyList();
        when(timeRecordService.createTimeRecords(anyList())).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records/batch")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isEmpty());

        verify(timeRecordService).createTimeRecords(anyList());
    }

    @Test
    @WithMockUser
    void createTimeRecords_WithInvalidEmployeeId_ShouldReturnBadRequest() throws Exception {
        // Given
        List<TimeRecordRequest> requests = List.of(
                new TimeRecordRequest(
                        "invalid-emp",
                        LocalDate.of(2024, 1, 15),
                        LocalDateTime.of(2024, 1, 15, 9, 0),
                        TimeRecord.RecordType.CLOCK_IN,
                        TimeRecord.LocationType.OFFICE,
                        "Morning clock in",
                        false
                )
        );

        when(timeRecordService.createTimeRecords(anyList()))
                .thenThrow(new EmployeeNotFoundException("Employee not found: ", "invalid-emp"));

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records/batch")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isBadRequest());

        verify(timeRecordService).createTimeRecords(anyList());
    }

    @Test
    @WithMockUser
    void createTimeRecords_WithMultipleDifferentEmployees_ShouldCreateAll() throws Exception {
        // Given
        List<TimeRecordRequest> requests = Arrays.asList(
                new TimeRecordRequest(
                        "emp1",
                        LocalDate.of(2024, 1, 15),
                        LocalDateTime.of(2024, 1, 15, 9, 0),
                        TimeRecord.RecordType.CLOCK_IN,
                        TimeRecord.LocationType.OFFICE,
                        "Employee 1 clock in",
                        false
                ),
                new TimeRecordRequest(
                        "emp2",
                        LocalDate.of(2024, 1, 15),
                        LocalDateTime.of(2024, 1, 15, 9, 15),
                        TimeRecord.RecordType.CLOCK_IN,
                        TimeRecord.LocationType.HOME,
                        "Employee 2 clock in",
                        false
                )
        );

        List<TimeRecordResponse> responses = Arrays.asList(
                createTimeRecordResponse("1", "emp1"),
                createTimeRecordResponse("2", "emp2")
        );

        when(timeRecordService.createTimeRecords(anyList())).thenReturn(responses);

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records/batch")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].employeeId").value("emp1"))
                .andExpect(jsonPath("$[1].employeeId").value("emp2"));

        verify(timeRecordService).createTimeRecords(anyList());
    }

    @Test
    @WithMockUser
    void createTimeRecords_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Given - malformed JSON
        String invalidJson = "[{\"employeeId\": \"emp1\", \"recordDate\": \"invalid-date\"}]";

        // When & Then
        mockMvc.perform(post("/api/timetrack/time-records/batch")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());

        verify(timeRecordService, never()).createTimeRecords(anyList());
    }

    private TimeRecordResponse createTimeRecordResponse(String id, String employeeId) {
        return new TimeRecordResponse(
                id,
                employeeId,
                "John",
                "Doe",
                LocalDate.of(2024, 1, 15),
                LocalDateTime.of(2024, 1, 15, 9, 0),
                TimeRecord.RecordType.CLOCK_IN,
                TimeRecord.LocationType.OFFICE,
                "Test notes",
                false,
//                false,
                LocalDateTime.of(2024, 1, 15, 9, 0),
                LocalDateTime.of(2024, 1, 15, 9, 0)
        );
    }


}