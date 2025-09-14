package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.exceptions.TimeRecordNotFoundException;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
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