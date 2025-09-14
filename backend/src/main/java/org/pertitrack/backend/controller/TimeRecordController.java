package org.pertitrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.MessageResponse;
import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.service.TimeRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
