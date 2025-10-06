package org.pertitrack.backend.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.MessageResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordRequest;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.service.TimeRecordService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetrack/time-records")
@RequiredArgsConstructor
public class TimeRecordController {

    private final TimeRecordService timeRecordService;

    @GetMapping
    public ResponseEntity<List<TimeRecordResponse>> getAllTimeRecords() {
        List<TimeRecordResponse> timeRecords = timeRecordService.getAllTimeRecords();
        return ResponseEntity.ok(timeRecords);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeRecordResponse> getTimeRecordById(@PathVariable String id) {
        try {
            TimeRecordResponse timeRecord = timeRecordService.getTimeRecordById(id);
            return ResponseEntity.ok(timeRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TimeRecordResponse>> getTimeRecordsByEmployeeId(
            @PathVariable String employeeId) {
        List<TimeRecordResponse> timeRecords = timeRecordService.getTimeRecordsByEmployeeId(employeeId);
        return ResponseEntity.ok(timeRecords);
    }

    @GetMapping("/my-records")
    public ResponseEntity<List<TimeRecordResponse>> getMyTimeRecords(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String recordType) {
        try {
            TimeRecord.RecordType type = null;
            if (recordType != null && !recordType.isEmpty()) {
                type = TimeRecord.RecordType.valueOf(recordType.toUpperCase());
            }

            List<TimeRecordResponse> timeRecords = timeRecordService.getMyTimeRecords(startDate, endDate, type);
            return ResponseEntity.ok(timeRecords);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/my-records/today")
    public ResponseEntity<List<TimeRecordResponse>> getMyTodayRecords() {
        try {
            List<TimeRecordResponse> timeRecords = timeRecordService.getMyTodayRecords();
            return ResponseEntity.ok(timeRecords);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<TimeRecordResponse> createTimeRecord(
            @Valid @RequestBody TimeRecordRequest request) {
        try {
            TimeRecordResponse timeRecord = timeRecordService.createTimeRecord(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(timeRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<List<TimeRecordResponse>> createTimeRecords(
            @Valid @RequestBody List<TimeRecordRequest> requests) {
        try {
            List<TimeRecordResponse> timeRecords = timeRecordService.createTimeRecords(requests);
            return ResponseEntity.status(HttpStatus.CREATED).body(timeRecords);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeRecordResponse> updateTimeRecord(
            @PathVariable String id,
            @Valid @RequestBody TimeRecordUpdateRequest request) {
        try {
            TimeRecordResponse timeRecord = timeRecordService.updateTimeRecord(id, request);
            return ResponseEntity.ok(timeRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTimeRecord(@PathVariable String id) {
        try {
            timeRecordService.deleteTimeRecord(id);
            return ResponseEntity.ok(new MessageResponse("Time record deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DTO for updating notes
    public record UpdateNotesRequest(
            @NotBlank(message = "Notes cannot be blank")
            @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
            String notes
    ) {}

}
