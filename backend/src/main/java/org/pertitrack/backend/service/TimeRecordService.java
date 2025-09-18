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
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimeRecordService {
    private final TimeRecordRepository timeRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final TimeRecordMapper timeRecordMapper;
    private final IdService idService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new EmployeeNotFoundException("Current employee not found", currentEmail));
    }

    private Employee getCurrentEmployee() {
        User currentUser = getCurrentUser();
        return employeeRepository.findByUser_Id(currentUser.getId())
                .orElseThrow(() -> new EmployeeNotFoundException("Current employee not found", currentUser.getEmail()));
    }

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

    public List<TimeRecordResponse> getMyTodayRecords() {
        Employee currentEmployee = getCurrentEmployee();
        LocalDate today = LocalDate.now();

        List<TimeRecord> timeRecords = timeRecordRepository.findByEmployeeAndRecordDateOrderByRecordTimeDesc(
                currentEmployee, today);

        return timeRecordMapper.toResponseList(timeRecords);
    }

    public TimeRecordResponse updateTimeRecordNotes(String id, String notes) {
        Employee currentEmployee = getCurrentEmployee();

        TimeRecord timeRecord = timeRecordRepository.findById(id)
                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found", id));

        // Ensure the current user can only update their own records
        if (!timeRecord.getEmployee().getId().equals(currentEmployee.getId())) {
            throw new UnauthorizedOperationException("You can only update your own time records");
        }

        timeRecord.setNotes(notes);
        TimeRecord updatedRecord = timeRecordRepository.save(timeRecord);

        return timeRecordMapper.toResponse(updatedRecord);
    }

    public List<TimeRecordResponse> getAllTimeRecords() {
        List<TimeRecord> entities = timeRecordRepository.findAll();
        return timeRecordMapper.toResponseList(entities);
    }

    public TimeRecordResponse getTimeRecordById(String id) {
        TimeRecord timeRecord = timeRecordRepository.findById(id)
                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found with id: ", id));
        return timeRecordMapper.toResponse(timeRecord);
    }

    public List<TimeRecordResponse> getTimeRecordsByEmployeeId(String employeeId) {
        List<TimeRecord> entities = timeRecordRepository.findByEmployeeId(employeeId);
        return timeRecordMapper.toResponseList(entities);
    }

//    public List<TimeRecordResponse> getPendingManualRecords() {
//        List<TimeRecord> entities = timeRecordRepository.findPendingManualRecords();
//        return timeRecordMapper.toResponseList(entities);
//    }

//    public List<TimeRecordResponse> getApprovedRecords() {
//        List<TimeRecord> entities = timeRecordRepository.findApprovedRecords();
//        return timeRecordMapper.toResponseList(entities);
//    }

//    public List<TimeRecordResponse> getTimeRecordsByTimeRange(
//            LocalDateTime startTime, LocalDateTime endTime) {
//        List<TimeRecord> entities = timeRecordRepository.findByRecordTimeBetween(startTime, endTime);
//        return timeRecordMapper.toResponseList(entities);
//    }

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

//    @Transactional
//    public TimeRecordResponse approveTimeRecord(String id, TimeRecordApprovalRequest request) {
//        TimeRecord timeRecord = timeRecordRepository.findById(id)
//                .orElseThrow(() -> new TimeRecordNotFoundException("Time record not found with id: ", id));
//
//        Employee approver = employeeRepository.findById(request.approverId())
//                .orElseThrow(() -> new ApproverNotFoundException("Approver not found with id: ", request.approverId()));
//
//        timeRecord.approve(approver);
//
//        TimeRecord approvedTimeRecord = timeRecordRepository.save(timeRecord);
//        return timeRecordMapper.toResponse(approvedTimeRecord);
//    }

    @Transactional
    public void deleteTimeRecord(String id) {
        if (!timeRecordRepository.existsById(id)) {
            throw new TimeRecordNotFoundException("Time record not found with id: ", id);
        }
        timeRecordRepository.deleteById(id);
    }

}
