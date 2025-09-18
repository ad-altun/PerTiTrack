package org.pertitrack.backend.dto.timeTrackingDto;

import lombok.With;

@With
public record CurrentStatusResponse(
        boolean isWorking,
        boolean isOnBreak,
        String currentLocation,
        TimeRecordResponse lastEntry
) {
}
