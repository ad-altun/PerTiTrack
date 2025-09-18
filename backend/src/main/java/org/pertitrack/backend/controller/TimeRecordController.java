package org.pertitrack.backend.controller;

import jakarta.validation.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.pertitrack.backend.dto.*;
import org.pertitrack.backend.dto.timeTrackingDto.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.pertitrack.backend.service.*;
import org.springframework.format.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;

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

    @PutMapping("/{id}/notes")
    public ResponseEntity<TimeRecordResponse> updateTimeRecordNotes(
            @PathVariable String id,
            @Valid @RequestBody UpdateNotesRequest request) {
        try {
            TimeRecordResponse timeRecord = timeRecordService.updateTimeRecordNotes(id, request.notes());
            return ResponseEntity.ok(timeRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


//    @GetMapping("/pending-manual")
//    public ResponseEntity<List<TimeRecordResponse>> getPendingManualRecords() {
//        List<TimeRecordResponse> timeRecords = timeRecordService.getPendingManualRecords();
//        return ResponseEntity.ok(timeRecords);
//    }

//    @GetMapping("/approved")
//    public ResponseEntity<List<TimeRecordResponse>> getApprovedRecords() {
//        List<TimeRecordResponse> timeRecords = timeRecordService.getApprovedRecords();
//        return ResponseEntity.ok(timeRecords);
//    }

//    @GetMapping("/time-range")
//    public ResponseEntity<List<TimeRecordResponse>> getTimeRecordsByTimeRange(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
//        List<TimeRecordResponse> timeRecords = timeRecordService
//                .getTimeRecordsByTimeRange(startTime, endTime);
//        return ResponseEntity.ok(timeRecords);
//    }

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

//    @PutMapping("/{id}/approve")
//    public ResponseEntity<TimeRecordResponse> approveTimeRecord(
//            @PathVariable String id,
//            @Valid @RequestBody TimeRecordApprovalRequest request) {
//        try {
//            TimeRecordResponse timeRecord = timeRecordService.approveTimeRecord(id, request);
//            return ResponseEntity.ok(timeRecord);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

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
