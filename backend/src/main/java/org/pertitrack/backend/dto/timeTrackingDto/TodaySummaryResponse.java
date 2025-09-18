package org.pertitrack.backend.dto.timeTrackingDto;


import lombok.With;

@With
public record TodaySummaryResponse(
        String arrivalTime,
        String departureTime,
        String breakTime,
        String workingTime,
        String flexTime,
        String status
) {
}
