package org.pertitrack.backend.dto.timeTrackingDto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.With;

@With
public record TodaySummaryResponse(

        @JsonFormat(pattern = "HH:mm:ss")
        String arrivalTime,

        @JsonFormat(pattern = "HH:mm:ss")
        String departureTime,

        @JsonFormat(pattern = "HH:mm:ss")
        String breakTime,

        @JsonFormat(pattern = "HH:mm:ss")
        String workingTime,

        @JsonFormat(pattern = "HH:mm:ss")
        String flexTime,
        String status,
        boolean isWorking,
        boolean isOnBreak
) {
}
