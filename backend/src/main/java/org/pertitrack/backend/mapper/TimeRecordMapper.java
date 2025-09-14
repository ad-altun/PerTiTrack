package org.pertitrack.backend.mapper;

import org.pertitrack.backend.dto.TimeRecordRequest;
import org.pertitrack.backend.dto.TimeRecordResponse;
import org.pertitrack.backend.dto.TimeRecordUpdateRequest;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TimeRecordMapper {

    public TimeRecord toEntity(TimeRecordRequest request, Employee employee) {
        if (request == null || employee == null) {
            return null;
        }

        TimeRecord timeRecord = new TimeRecord();
        timeRecord.setEmployee(employee);
        timeRecord.setRecordDate(request.recordDate());
        timeRecord.setRecordTime(request.recordTime());
        timeRecord.setRecordType(request.recordType());

        timeRecord.setLocationType(request.locationType());
        timeRecord.setNotes(request.notes());
        timeRecord.setIsManual(request.isManual());

        return timeRecord;
    }

    public TimeRecordResponse toResponse(TimeRecord entity) {
        if (entity == null) {
            return null;
        }

        String id = entity.getId();

        String employeeId = null;
        String employeeFirstName = null;
        String employeeLastName = null;
        if (entity.getEmployee() != null) {
            employeeId = entity.getEmployee().getId();
            employeeFirstName = entity.getEmployee().getFirstName();
            employeeLastName = entity.getEmployee().getLastName();
        }

        LocalDate recordDate = entity.getRecordDate();
        LocalDateTime recordTime = entity.getRecordTime();
        TimeRecord.RecordType recordType = entity.getRecordType();
        TimeRecord.LocationType locationType = entity.getLocationType();
        String notes = entity.getNotes();

        // entity.getIsManual() might be Boolean or primitive; handle both
        Boolean isManual = entity.getIsManual() != null ? entity.getIsManual() : Boolean.FALSE;

        // entity.isApproved() might be primitive boolean; wrap to Boolean
        Boolean isApproved = Boolean.valueOf(entity.isApproved());

        String approvedById = null;
        String approvedByFirstName = null;
        String approvedByLastName = null;
        if (entity.getApprovedBy() != null) {
            approvedById = entity.getApprovedBy().getId();
            approvedByFirstName = entity.getApprovedBy().getFirstName();
            approvedByLastName = entity.getApprovedBy().getLastName();
        }

        LocalDateTime approvedAt = entity.getApprovedAt();
        LocalDateTime createdAt = entity.getCreatedAt();
        LocalDateTime updatedAt = entity.getUpdatedAt();

//        return new TimeRecordResponse(
//                id, employeeId, employeeFirstName, employeeLastName,
//                recordDate, recordTime, recordType, locationType, notes,
//                isManual, isApproved, approvedById, approvedByFirstName,
//                approvedByLastName, approvedAt, createdAt, updatedAt
//        );

        return new TimeRecordResponse(
                id, employeeId, employeeFirstName, employeeLastName,
                recordDate, recordTime, recordType, locationType, notes,
                isManual, isApproved, createdAt, updatedAt
        );
    }

    public List<TimeRecordResponse> toResponseList(List<TimeRecord> entities) {
        if (entities == null || entities.isEmpty()) return List.of();
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void updateEntity(TimeRecord entity, TimeRecordUpdateRequest request) {
        if (request == null || entity == null) {
            return;
        }

        if (request.recordDate() != null) {
            entity.setRecordDate(request.recordDate());
        }
        if (request.recordTime() != null) {
            entity.setRecordTime(request.recordTime());
        }
        if (request.recordType() != null) {
            entity.setRecordType(request.recordType());
        }
        if (request.locationType() != null) {
            entity.setLocationType(request.locationType());
        }
        if (request.notes() != null) {
            entity.setNotes(request.notes());
        }
        if (request.isManual() != null) {
            entity.setIsManual(request.isManual());
        }
    }
}




