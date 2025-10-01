package org.pertitrack.backend.dto.timeTrackingDto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.With;
import org.pertitrack.backend.entity.timetrack.TimeRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

@With
public record TimeRecordRequest(
        String employeeId,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate recordDate,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime recordTime,

        TimeRecord.RecordType recordType,
        TimeRecord.LocationType locationType,
        String notes,
        Boolean isManual
) {
}
