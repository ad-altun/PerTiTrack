package org.pertitrack.backend.dto;

import org.pertitrack.backend.entity.timetrack.TimeRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TimeRecordUpdateRequest(
        LocalDate recordDate,
        LocalDateTime recordTime,
        TimeRecord.RecordType recordType,
        TimeRecord.LocationType locationType,
        String notes,
        Boolean isManual
) {
}
