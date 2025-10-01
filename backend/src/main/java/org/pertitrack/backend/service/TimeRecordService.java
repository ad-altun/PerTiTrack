package org.pertitrack.backend.service;

import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.timeTrackingDto.CurrentStatusResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordRequest;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordResponse;
import org.pertitrack.backend.dto.timeTrackingDto.TimeRecordUpdateRequest;
import org.pertitrack.backend.dto.timeTrackingDto.TodaySummaryResponse;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.exceptions.TimeRecordNotFoundException;
import org.pertitrack.backend.mapper.TimeRecordMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.TimeRecordRepository;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.pertitrack.backend.util.TimeUtils.shortFormatTime;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeRecordService {

    private final TimeRecordRepository timeRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final TimeRecordMapper timeRecordMapper;

    // Authentication methods
    // -------------------------------------------------------------
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

    // Quick Actions methods (moved from TimeBookingService)
    // -------------------------------------------------------------

    @Transactional
    public TimeRecordResponse quickClockIn(
            TimeRecord.RecordType recordType, String notes, TimeRecord.LocationType locationType) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee can clock in
        if (!canClockIn(employee, today)) {
            throw new IllegalStateException("Employee is already clocked in. " +
                    "Please clock out first.");
        }

        // Create new clock in record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.CLOCK_IN,
                locationType != null ? locationType : TimeRecord.LocationType.OFFICE,
                notes != null ? notes : "Clock in", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    @Transactional
    // Standard clock in (backward compatibility)
    public TimeRecordResponse quickClockIn(TimeRecord.RecordType recordType, String notes) {
        return quickClockIn(recordType, notes, TimeRecord.LocationType.OFFICE);
    }

    // clock out
    @Transactional
    public TimeRecordResponse quickClockOut(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Check if employee can clock out
        if (!canClockOut(employee, today)) {
            throw new IllegalStateException("Employee is not clocked in." +
                    " Cannot clock out.");
        }

        // Create new clock out record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.CLOCK_OUT,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Clock out", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    @Transactional
    public TimeRecordResponse quickBreakStart(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        if (!canStartBreak(employee, today)) {
            StatusCalculationResult status = getCurrentStatusForEmployee(employee, today);
            if (!status.isWorking) {
                throw new IllegalStateException("Employee must be clocked in to start break.");
            } else {
                throw new IllegalStateException("Employee is already on break.");
            }
        }

        // Create new break start record
        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.BREAK_START,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Break started", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    @Transactional
    public TimeRecordResponse quickBreakEnd(TimeRecord.RecordType recordType, String notes) {
        Employee employee = getCurrentEmployee();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        if (!canEndBreak(employee, today)) {
            throw new IllegalStateException("Employee is not on break. " +
                    "Cannot end break.");
        }

        TimeRecord timeRecord = createTimeRecord(employee, today, now, TimeRecord.RecordType.BREAK_END,
                TimeRecord.LocationType.OFFICE, notes != null ? notes : "Break ended", false);

        TimeRecord savedRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedRecord);
    }

    // Location-specific clock in methods
    @Transactional
    public TimeRecordResponse clockInHome(String notes) {
        return quickClockIn(TimeRecord.RecordType.CLOCK_IN,
                notes != null ? notes : "Working from home",
                TimeRecord.LocationType.HOME);
    }

    @Transactional
    public TimeRecordResponse clockInBusinessTrip(String notes) {
        return quickClockIn(TimeRecord.RecordType.CLOCK_IN,
                notes != null ? notes : "Business trip work",
                TimeRecord.LocationType.BUSINESS_TRIP);
    }

    // Status and summary methods
    // -------------------------------------------------------------

    @Transactional(readOnly = true)
    public CurrentStatusResponse getCurrentStatus() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        // Get today's records in chronological order for accurate status determination
        List<TimeRecord> todayRecords = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeAsc(employee, today);

        // Calculate current status using the SAME logic as calculateTodaySummary
        StatusCalculationResult statusResult = calculateCurrentStatus(todayRecords);

        // Get last time record entry for location
        Optional<TimeRecord> lastEntry = timeRecordRepository
                .findTopByEmployeeAndRecordDateOrderByRecordTimeDesc(employee, today);

        String currentLocation = lastEntry
                .map(record -> record.getLocationType().name())
                .orElse("OFFICE");

        return new CurrentStatusResponse(
                statusResult.isWorking,
                statusResult.isOnBreak,
                currentLocation,
                lastEntry.map(timeRecordMapper::toResponse).orElse(null)
        );
    }

    @Transactional(readOnly = true)
    public TodaySummaryResponse getTodaySummary() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> todayRecords = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeAsc(employee, today);

        return calculateTodaySummary(todayRecords);
    }

    // CRUD operations
    // -------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getMyTimeRecords(LocalDate startDate, LocalDate endDate, TimeRecord.RecordType recordType) {
        Employee currentEmployee = getCurrentEmployee();

        // Set default date range if not provided (last 30 days)
        LocalDate fromDate = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate toDate = endDate != null ? endDate : LocalDate.now();

        List<TimeRecord> timeRecords;

        if (recordType != null) {
            timeRecords = timeRecordRepository.findByEmployeeAndRecordDateBetweenAndRecordTypeOrderByRecordTimeDesc(
                    currentEmployee, fromDate, toDate, recordType);
        } else {
            timeRecords = timeRecordRepository.findByEmployeeAndRecordDateBetweenOrderByRecordTimeDesc(
                    currentEmployee, fromDate, toDate);
        }

        return timeRecordMapper.toResponseList(timeRecords);
    }

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getTodayTimeRecords() {
        Employee employee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> records = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeDesc(employee, today);

        return records.stream()
                .map(timeRecordMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getAllTimeRecords() {
        List<TimeRecord> entities = timeRecordRepository.findAll();
        return timeRecordMapper.toResponseList(entities);
    }

    @Transactional(readOnly = true)
    public TimeRecordResponse getTimeRecordById(String id) {
        TimeRecord timeRecord = timeRecordRepository.findById(id)
                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found with id: ", id));
        return timeRecordMapper.toResponse(timeRecord);
    }

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getTimeRecordsByEmployeeId(String employeeId) {
        List<TimeRecord> entities = timeRecordRepository.findByEmployeeId(employeeId);
        return timeRecordMapper.toResponseList(entities);
    }

    @Transactional
    public TimeRecordResponse createTimeRecord(TimeRecordRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: ", request.employeeId()));

        TimeRecord timeRecord = timeRecordMapper.toEntity(request, employee);
        TimeRecord savedTimeRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(savedTimeRecord);
    }

    @Transactional
    public TimeRecordResponse updateTimeRecord(String id, TimeRecordUpdateRequest request) {
        TimeRecord timeRecord = timeRecordRepository.findById(id)
                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found with id: ", id));

        timeRecordMapper.updateEntity(timeRecord, request);

        TimeRecord updatedTimeRecord = timeRecordRepository.save(timeRecord);
        return timeRecordMapper.toResponse(updatedTimeRecord);
    }

    // notes update - delete methods
    // -------------------------------------------------------------

    @Transactional
    public TimeRecordResponse updateTimeRecordNotes(String recordId, String notes) {
        Employee employee = getCurrentEmployee();

        TimeRecord record = timeRecordRepository.findById(recordId)
                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found", recordId));

        if (!record.getEmployee().getId().equals(employee.getId())) {
            throw new SecurityException("You can only update your own time records");
        }

        record.setNotes(notes);
        record.setUpdatedAt(LocalDateTime.now());

        TimeRecord savedRecord = timeRecordRepository.save(record);
        return timeRecordMapper.toResponse(savedRecord);
    }

    @Transactional
    public void deleteTimeRecord(String id) {
        if (!timeRecordRepository.existsById(id)) {
            throw new TimeRecordNotFoundException("Time record not found with id: ", id);
        }
        timeRecordRepository.deleteById(id);
    }

    // Helper methods
    // -------------------------------------------------------------

    // Helper method to get current status for an employee on a specific date
    private StatusCalculationResult getCurrentStatusForEmployee(Employee employee, LocalDate date) {
        List<TimeRecord> todayRecords = timeRecordRepository
                .findByEmployeeAndRecordDateOrderByRecordTimeAsc(employee, date);
        return calculateCurrentStatus(todayRecords);
    }

    // Helper method for checking if employee can clock in
    private boolean canClockIn(Employee employee, LocalDate date) {
        StatusCalculationResult status = getCurrentStatusForEmployee(employee, date);
        return !status.isWorking && !status.isOnBreak;
    }

    // Helper method for checking if employee can clock out
    private boolean canClockOut(Employee employee, LocalDate date) {
        StatusCalculationResult status = getCurrentStatusForEmployee(employee, date);
        return status.isWorking || status.isOnBreak;
    }

    // Helper method for checking if employee can start break
    private boolean canStartBreak(Employee employee, LocalDate date) {
        StatusCalculationResult status = getCurrentStatusForEmployee(employee, date);
        return status.isWorking && !status.isOnBreak;
    }

    // Helper method for checking if employee can end break
    private boolean canEndBreak(Employee employee, LocalDate date) {
        StatusCalculationResult status = getCurrentStatusForEmployee(employee, date);
        return status.isOnBreak;
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

    // Status calculation Logic
    // -------------------------------------------------------------
    private StatusCalculationResult calculateCurrentStatus(List<TimeRecord> records) {
        if (records.isEmpty()) {
            return new StatusCalculationResult("Not Started", false, false);
        }

        LocalDateTime lastClockIn = null;
        LocalDateTime lastClockOut = null;
        LocalDateTime lastBreakStart = null;
        LocalDateTime lastBreakEnd = null;

        // Find the most recent records of each type
        for (TimeRecord record : records) {
            switch (record.getRecordType()) {
                case CLOCK_IN:
                    lastClockIn = record.getRecordTime();
                    break;
                case CLOCK_OUT:
                    lastClockOut = record.getRecordTime();
                    break;
                case BREAK_START:
                    lastBreakStart = record.getRecordTime();
                    break;
                case BREAK_END:
                    lastBreakEnd = record.getRecordTime();
                    break;
            }
        }

        // Determine current status based on the most recent actions
        boolean isClockedIn = lastClockIn != null &&
                (lastClockOut == null || lastClockIn.isAfter(lastClockOut));

        boolean isOnBreak = lastBreakStart != null &&
                (lastBreakEnd == null || lastBreakStart.isAfter(lastBreakEnd));

        // Status logic:
        String status;
        boolean isWorking;

        if (isClockedIn && !isOnBreak) {
            status = "Working";
            isWorking = true;
        } else if (isClockedIn && isOnBreak) {
            status = "Break";
            isWorking = false; // On break = not actively working
        } else if (lastClockOut != null) {
            status = "Finished";
            isWorking = false;
        } else {
            status = "Not Started";
            isWorking = false;
        }

        return new StatusCalculationResult(status, isWorking, isOnBreak && isClockedIn);
    }

    private TodaySummaryResponse calculateTodaySummary(List<TimeRecord> records) {
        if (records.isEmpty()) {
            return new TodaySummaryResponse(
                    null, null,
                    "00:00", "00:00", "-08:00", "Not Started",
                    false, false);
        }

        LocalTime arrivalTime = null;
        LocalTime departureTime = null;
        Duration totalWorkingTime = Duration.ZERO;
        Duration totalBreakTime = Duration.ZERO;

        LocalDateTime sessionStart = null;
        String sessionType = null; // "WORK" or "BREAK"

        // Process records to calculate times
        for (TimeRecord record : records) {
            switch (record.getRecordType()) {
                case CLOCK_IN -> {
                    if (arrivalTime == null) {
                        arrivalTime = record.getRecordTime().toLocalTime();
                    }
                    sessionStart = record.getRecordTime();
                    sessionType = "WORK";
                }
                case BREAK_START -> {
                    if ("WORK".equals(sessionType) && sessionStart != null) {
                        totalWorkingTime = totalWorkingTime.plus(
                                Duration.between(sessionStart, record.getRecordTime()));
                    }
                    sessionStart = record.getRecordTime();
                    sessionType = "BREAK";
                }
                case BREAK_END -> {
                    if ("BREAK".equals(sessionType) && sessionStart != null) {
                        totalBreakTime = totalBreakTime.plus(
                                Duration.between(sessionStart, record.getRecordTime()));
                    }
                    sessionStart = record.getRecordTime();
                    sessionType = "WORK";
                }
                case CLOCK_OUT -> {
                    departureTime = record.getRecordTime().toLocalTime();
                    if ("WORK".equals(sessionType) && sessionStart != null) {
                        totalWorkingTime = totalWorkingTime.plus(
                                Duration.between(sessionStart, record.getRecordTime()));
                    } else if ("BREAK".equals(sessionType) && sessionStart != null) {
                        totalBreakTime = totalBreakTime.plus(
                                Duration.between(sessionStart, record.getRecordTime()));
                    }
                    sessionStart = null;
                    sessionType = null;
                }
            }
        }

        // add current session time based on actual status
        LocalDateTime now = LocalDateTime.now();

        // Only add current time if we're actually in an active session
        if (sessionStart != null) {
            if ("WORK".equals(sessionType)) {
                totalWorkingTime = totalWorkingTime.plus(Duration.between(sessionStart, now));
            } else if ("BREAK".equals(sessionType)) {
                totalBreakTime = totalBreakTime.plus(Duration.between(sessionStart, now));
            }
        }

        Duration netWorkingTime = totalWorkingTime;
        if (netWorkingTime.isNegative()) netWorkingTime = Duration.ZERO;

        // Standard work day (8 hours)
        Duration standardWorkDay = Duration.ofHours(8);
        Duration flexTime = netWorkingTime.minus(standardWorkDay);

        // Calculate current status using unified logic
        StatusCalculationResult statusResult = calculateCurrentStatus(records);


        return new TodaySummaryResponse(
                arrivalTime != null ? shortFormatTime(arrivalTime) : null,
                departureTime != null ? shortFormatTime(departureTime) : null,
                formatDurationNoSeconds(totalBreakTime),
                formatFlexTimeNoSeconds(netWorkingTime),
                formatFlexTimeNoSeconds(flexTime),
                statusResult.status,
                statusResult.isWorking,
                statusResult.isOnBreak
        );
    }

    // Formatting Helpers
    // -------------------------------------------------------------
    private String formatDurationNoSeconds(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
//        long seconds = duration.toSecondsPart();
//        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        return String.format("%02d:%02d", hours, minutes);
    }

    private String formatFlexTimeNoSeconds(Duration flexTime) {
        String sign = flexTime.isNegative() ? "-" : "+";
        Duration abs = flexTime.abs();
        long hours = abs.toHours();
        long minutes = abs.toMinutesPart();
//        long seconds = abs.toSecondsPart();
//        return String.format("%s%02d:%02d:%02d", sign, hours, minutes, seconds);
        return String.format("%s%02d:%02d", sign, hours, minutes);
    }

    // Helper class for status calculation
    private static class StatusCalculationResult {
        final String status;
        final boolean isWorking;
        final boolean isOnBreak;

        StatusCalculationResult(String status, boolean isWorking, boolean isOnBreak) {
            this.status = status;
            this.isWorking = isWorking;
            this.isOnBreak = isOnBreak;
        }
    }

    @Transactional(readOnly = true)
    public List<TimeRecordResponse> getMyTodayRecords() {
        Employee currentEmployee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> timeRecords = timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeDesc(
                currentEmployee, today);

        return timeRecordMapper.toResponseList(timeRecords);
    }

}
