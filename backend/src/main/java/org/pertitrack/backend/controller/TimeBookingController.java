package org.pertitrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.timeTrackingDto.CurrentStatusResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TodaySummaryResponse;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EntityNotFoundException;
import org.pertitrack.backend.service.TimeBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetrack")
@RequiredArgsConstructor
public class TimeBookingController {

    private final TimeBookingService timeBookingService;

    @PostMapping("/time-records/time-bookings/clock-in")
    public ResponseEntity<TimeRecordResponse> quickClockIn(
            @Valid @RequestBody EnhancedQuickActionRequest request ) {
        try {
            TimeRecordResponse timeRecord;
            if (request.locationType() != null) {
                timeRecord = timeBookingService.quickClockIn(
                        TimeRecord.RecordType.CLOCK_IN,
                        request.notes(),
                        request.locationType()
                );
            } else {
                timeRecord = timeBookingService.quickClockIn(
                        TimeRecord.RecordType.CLOCK_IN,
                        request.notes()
                );
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    @PostMapping("/time-records/time-bookings/clock-out")
    public ResponseEntity<TimeRecordResponse> quickClockOut(
            @Valid @RequestBody QuickActionRequest request) {
        try {
            TimeRecordResponse timeRecord = timeBookingService.quickClockOut(
                    TimeRecord.RecordType.CLOCK_OUT,
                    request.notes()
            );
            return ResponseEntity.ok(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    @PostMapping("/time-records/time-bookings/break-start")
    public ResponseEntity<TimeRecordResponse> quickBreakStart(
            @Valid @RequestBody QuickActionRequest request) {
        try {
            TimeRecordResponse timeRecord = timeBookingService.quickBreakStart(
                    TimeRecord.RecordType.BREAK_START,
                    request.notes()
            );
            return ResponseEntity.ok(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    @PostMapping("/time-records/time-bookings/break-end")
    public ResponseEntity<TimeRecordResponse> quickBreakEnd(
            @Valid @RequestBody QuickActionRequest request) {
        try {
            TimeRecordResponse timeRecord = timeBookingService.quickBreakEnd(
                    TimeRecord.RecordType.BREAK_END,
                    request.notes()
            );
            return ResponseEntity.ok(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    // Location-specific clock in endpoints
    @PostMapping("/time-records/time-bookings/clock-in/home")
    public ResponseEntity<TimeRecordResponse> clockInHome(
            @RequestBody(required = false) LocationClockInRequest request) {
        try {
            String notes = request != null ? request.notes() : null;
            TimeRecordResponse timeRecord = timeBookingService.clockInHome(notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    @PostMapping("/time-records/time-bookings/clock-in/business-trip")
    public ResponseEntity<TimeRecordResponse> clockInBusinessTrip(
            @RequestBody(required = false) LocationClockInRequest request) {
        try {
            String notes = request != null ? request.notes() : null;
            TimeRecordResponse timeRecord = timeBookingService.clockInBusinessTrip(notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(timeRecord);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    // Status and data endpoints
    @GetMapping("/status/current")
    public ResponseEntity<CurrentStatusResponse> getCurrentStatus() {
        try {
            CurrentStatusResponse status = timeBookingService.getCurrentStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/time-records/today")
    public ResponseEntity<List<TimeRecordResponse>> getTodayTimeRecords() {
        try {
            List<TimeRecordResponse> records = timeBookingService.getTodayTimeRecords();
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/summary/today")
    public ResponseEntity<TodaySummaryResponse> getTodaySummary() {
        try {
            TodaySummaryResponse summary = timeBookingService.getTodaySummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/time-records/{id}/notes")
    public ResponseEntity<TimeRecordResponse> updateTimeRecordNotes(
            @PathVariable String id,
            @Valid @RequestBody UpdateNotesRequest request) {
        try {
            TimeRecordResponse updatedRecord = timeBookingService.updateTimeRecordNotes(id, request.notes());
            return ResponseEntity.ok(updatedRecord);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound()
                    .header("X-Error-Message", e.getMessage())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("X-Error-Message", "An unexpected error occurred")
                    .build();
        }
    }

    // DTO for quick action requests
    public record QuickActionRequest(
            TimeRecord.RecordType recordType,
            String notes
    ) {}

    public record EnhancedQuickActionRequest(
            TimeRecord.RecordType recordType,
            String notes,
            TimeRecord.LocationType locationType
    ) {}

    public record LocationClockInRequest(
            String notes
    ) {}

    public record UpdateNotesRequest(
            String notes
    ) {}

}
