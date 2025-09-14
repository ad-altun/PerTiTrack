package org.pertitrack.backend.dto;

import lombok.With;
import org.pertitrack.backend.entity.timetrack.TimeRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

@With
public record TimeRecordRequest(
        String employeeId,
        LocalDate recordDate,
        LocalDateTime recordTime,
        TimeRecord.RecordType recordType,
        TimeRecord.LocationType locationType,
        String notes,
        Boolean isManual
) {
}
