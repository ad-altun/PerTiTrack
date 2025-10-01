// Determine the last booking type from the most recent record
import type { TimeRecord } from "../validation/timetrackSchemas.ts";
import { useGetCurrentStatusQuery, useGetTodayTimeRecordsQuery } from "../store/api/timetrackApi.ts";

export const useGetLastBookingType = (): TimeRecord["recordType"] => {
    // API call with error handling
    const {
        data: currentStatus,
    } = useGetCurrentStatusQuery();

    const {
        data: todayRecords,
    } = useGetTodayTimeRecordsQuery();

    // First, try to get from current status (most reliable)
    if ( currentStatus?.lastEntry?.recordType ) {
        return currentStatus.lastEntry.recordType;
    }

    // Fallback: get from today's records (ensure we get the most recent)
    if ( todayRecords && todayRecords.length > 0 ) {
        // Sort by recordTime to ensure we get the most recent
        const sortedRecords = [ ...todayRecords ].sort(( a, b ) => {
            return new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime();
        });
        return sortedRecords[ 0 ].recordType;
    }
    // No records available
    return 'CLOCK_OUT';
};