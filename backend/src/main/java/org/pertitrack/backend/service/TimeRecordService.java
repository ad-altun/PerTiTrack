package org.pertitrack.backend.service;

import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.exceptions.TimeRecordNotFoundException;
import org.pertitrack.backend.mapper.TimeRecordMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.TimeRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimeRecordService {
    private final TimeRecordRepository timeRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final TimeRecordMapper timeRecordMapper;
    private final IdService idService;

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
