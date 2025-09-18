package org.pertitrack.backend.service;

import lombok.*;
import org.pertitrack.backend.dto.timeTrackingDto.*;
import org.pertitrack.backend.entity.auth.*;
import org.pertitrack.backend.entity.personnel.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.pertitrack.backend.exceptions.*;
import org.pertitrack.backend.mapper.*;
import org.pertitrack.backend.repository.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.time.*;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeBookingService {

    private final TimeRecordRepository timeRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final TimeRecordMapper timeRecordMapper;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new EmployeeNotFoundException("Current user not found", currentEmail));
    }

    private Employee getCurrentEmployee() {
        User currentUser = getCurrentUser();
        return employeeRepository.findByUser_Id(currentUser.getId())
                .orElseThrow(() -> new EmployeeNotFoundException("Current employee not found", currentUser.getEmail()));
    }

    // clock in
    public TimeRecordResponse quickClockIn(
            TimeRecord.RecordType recordType, String notes, TimeRecord.LocationType locationType) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee is already clocked in today without clock out
        boolean isAlreadyClockedIn = isEmployeeClockedIn(employee, today);

        if (isAlreadyClockedIn) {
            throw new IllegalStateException("Employee is already clocked in." +
                    "Please clock out first.");
        }

        // Create new clock in record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.CLOCK_IN,
                locationType != null ? locationType : TimeRecord.LocationType.OFFICE,
                notes != null ? notes : "Clock in", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // Standard clock in (backward compatibility)
    public TimeRecordResponse quickClockIn(TimeRecord.RecordType recordType, String notes) {
        return quickClockIn(recordType, notes, TimeRecord.LocationType.OFFICE);
    }

    // clock out
    public TimeRecordResponse quickClockOut(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee is clocked in
        boolean isClockedIn = isEmployeeClockedIn(employee, today);

        if (!isClockedIn) {
            throw new IllegalStateException("Employee is not clocked in. " +
                    "Cannot clock out.");
        }

        // Create new clock out record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Clock out", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // start break
    public TimeRecordResponse quickBreakStart(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee is clocked in and not already on break
        boolean isClockedIn = isEmployeeClockedIn(employee, today);

        if (!isClockedIn) {
            throw new IllegalStateException("Employee must be clocked in to start break.");
        }

        // Check if already on break
        boolean isOnBreak = isEmployeeOnBreak(employee, today);

        if (isOnBreak) {
            throw new IllegalStateException("Employee is already on break.");
        }

        // Create new break start record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.BREAK_START,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Break started", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // end break
    public TimeRecordResponse quickBreakEnd(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee is on break
        boolean isOnBreak = isEmployeeOnBreak(employee, today);

        if (!isOnBreak) {
            throw new IllegalStateException("Employee is not on break. " +
                    "Cannot end break.");
        }

        // Create a new break end record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.BREAK_END,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Break ended", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // Location-specific clock in methods
    public TimeRecordResponse clockInHome(String notes) {
        return quickClockIn(TimeRecord.RecordType.CLOCK_IN,
                notes != null ? notes : "Working from home",
                TimeRecord.LocationType.HOME);
    }

    public TimeRecordResponse clockInBusinessTrip(String notes) {
        return quickClockIn(TimeRecord.RecordType.CLOCK_IN,
                notes != null ? notes : "Business trip work",
                TimeRecord.LocationType.BUSINESS_TRIP);
    }

    public TimeRecordResponse clockInClientSite(String notes) {
        return quickClockIn(TimeRecord.RecordType.CLOCK_IN,
                notes != null ? notes : "Working at client site",
                TimeRecord.LocationType.CLIENT_SITE);
    }

    // Get current employee status
    public CurrentStatusResponse getCurrentStatus() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        boolean isWorking = isEmployeeClockedIn(employee, today);
        boolean isOnBreak = isEmployeeOnBreak(employee, today);

        // Get last entry
        Optional<TimeRecord> lastEntry = timeRecordRepository
                .findTopByEmployeeAndRecordDateOrderByRecordTimeDesc(employee, today);

        String currentLocation = lastEntry
                .map(record -> record.getLocationType().name())
                .orElse("OFFICE");

        return new CurrentStatusResponse(isWorking, isOnBreak, currentLocation,
                lastEntry.map(timeRecordMapper::toResponse).orElse(null));
    }

    // Get today's time records
    public List<TimeRecordResponse> getTodayTimeRecords() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> records = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeDesc(employee, today);

        return records.stream()
                .map(timeRecordMapper::toResponse)
                .toList();
    }

    // Get today's summary with flextime calculation
    public TodaySummaryResponse getTodaySummary() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> todayRecords = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeAsc(employee, today);

        return calculateTodaySummary(todayRecords);
    }

    // Update time record notes
    @Transactional
    public TimeRecordResponse updateTimeRecordNotes(String recordId, String notes) {
        Employee employee = getCurrentEmployee();

        TimeRecord record = timeRecordRepository.findById(recordId)
                .orElseThrow(() -> new EntityNotFoundException("Time record not found"));

        // Verify the record belongs to the current employee
        if (!record.getEmployee().getId().equals(employee.getId())) {
            throw new SecurityException("You can only update your own time records");
        }

        // Update notes
        record.setNotes(notes);
        record.setUpdatedAt(LocalDateTime.now());

        TimeRecord savedRecord = timeRecordRepository.save(record);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // helper methods
    private boolean isEmployeeClockedIn(Employee employee, LocalDate date) {
        // Check if there's a clock in without corresponding clock out
        Optional<TimeRecord> lastClockIn = timeRecordRepository
                .findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                        employee, date, TimeRecord.RecordType.CLOCK_IN);

        if (lastClockIn.isEmpty()) {
            return false;
        }

        Optional<TimeRecord> lastClockOut = timeRecordRepository
                .findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                        employee, date, TimeRecord.RecordType.CLOCK_OUT);

        // If no clock out, or clock in is after clock out, then employee is clocked in
        return lastClockOut.isEmpty() ||
                lastClockIn.get().getRecordTime().isAfter(lastClockOut.get().getRecordTime());
    }

    private boolean isEmployeeOnBreak(Employee employee, LocalDate date) {
        // Check if there's a break start without corresponding break end
        Optional<TimeRecord> lastBreakStart = timeRecordRepository
                .findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                        employee, date, TimeRecord.RecordType.BREAK_START);

        if (lastBreakStart.isEmpty()) {
            return false;
        }

        Optional<TimeRecord> lastBreakEnd = timeRecordRepository
                .findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
                        employee, date, TimeRecord.RecordType.BREAK_END);

        // If no break end, or break start is after break end, then employee is on break
        return lastBreakEnd.isEmpty() ||
                lastBreakStart.get().getRecordTime().isAfter(lastBreakEnd.get().getRecordTime());
    }

    private TimeRecord createTimeRecord(Employee employee, LocalDate recordDate, LocalDateTime recordTime,
                                        TimeRecord.RecordType recordType, TimeRecord.LocationType locationType,
                                        String notes, boolean isManual) {
        TimeRecord timeRecord = new TimeRecord();
        timeRecord.setEmployee(employee);
        timeRecord.setRecordDate(recordDate);
        timeRecord.setRecordTime(recordTime);
        timeRecord.setRecordType(recordType);
        timeRecord.setLocationType(locationType);
        timeRecord.setNotes(notes);
        timeRecord.setIsManual(isManual);
        timeRecord.setCreatedAt(recordTime);
        timeRecord.setUpdatedAt(recordTime);
        return timeRecord;
    }

    private TodaySummaryResponse calculateTodaySummary(List<TimeRecord> records) {
        if (records.isEmpty()) {
            return new TodaySummaryResponse(null, null, "00:00:00", "00:00:00", "+00:00:00", "Not Started");
        }

        LocalTime arrivalTime = null;
        LocalTime departureTime = null;
        Duration totalWorkingTime = Duration.ZERO;
        Duration totalBreakTime = Duration.ZERO;

        LocalDateTime lastClockIn = null;
        LocalDateTime lastBreakStart = null;

        for (TimeRecord record : records) {
            switch (record.getRecordType()) {
                case CLOCK_IN:
                    if (arrivalTime == null) {
                        arrivalTime = record.getRecordTime().toLocalTime();
                    }
                    lastClockIn = record.getRecordTime();
                    break;

                case CLOCK_OUT:
                    departureTime = record.getRecordTime().toLocalTime();
                    if (lastClockIn != null) {
                        totalWorkingTime = totalWorkingTime.plus(
                                Duration.between(lastClockIn, record.getRecordTime()));
                        lastClockIn = null;
                    }
                    break;

                case BREAK_START:
                    lastBreakStart = record.getRecordTime();
                    break;

                case BREAK_END:
                    if (lastBreakStart != null) {
                        totalBreakTime = totalBreakTime.plus(
                                Duration.between(lastBreakStart, record.getRecordTime()));
                        lastBreakStart = null;
                    }
                    break;
            }
        }

        // If still clocked in, add current working time
        if (lastClockIn != null) {
            totalWorkingTime = totalWorkingTime.plus(
                    Duration.between(lastClockIn, LocalDateTime.now()));
        }

        // If still on break, add current break time
        if (lastBreakStart != null) {
            totalBreakTime = totalBreakTime.plus(
                    Duration.between(lastBreakStart, LocalDateTime.now()));
        }

        // Subtract break time from working time
        Duration netWorkingTime = totalWorkingTime.minus(totalBreakTime);

        // Standard work day (8 hours)
        Duration standardWorkDay = Duration.ofHours(8);
        Duration flexTime = netWorkingTime.minus(standardWorkDay);

        // Determine current status
        String status;
        if (lastClockIn != null && lastBreakStart == null) {
            status = "Working";
        } else if (lastBreakStart != null) {
            status = "Break";
        } else if (departureTime != null) {
            status = "Finished";
        } else {
            status = "Not Started";
        }

        return new TodaySummaryResponse(
                arrivalTime != null ? arrivalTime.toString() : null,
                departureTime != null ? departureTime.toString() : null,
                formatDuration(totalBreakTime),
                formatDuration(netWorkingTime),
                formatFlexTime(flexTime),
                status
        );
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        long seconds = duration.toSecondsPart();
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    private String formatFlexTime(Duration flexTime) {
        String sign = flexTime.isNegative() ? "-" : "+";
        Duration abs = flexTime.abs();
        long hours = abs.toHours();
        long minutes = abs.toMinutesPart();
        long seconds = abs.toSecondsPart();
        return String.format("%s%02d:%02d:%02d", sign, hours, minutes, seconds);
    }

}
