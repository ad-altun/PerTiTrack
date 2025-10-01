import { z } from 'zod';
import { recordTypeSchema, locationTypeSchema } from './timetrackSchemas';
import type { TimeRecordResponse } from './timetrackSchemas';


// Protocol Entry Schema - matching backend TimeRecordResponse structure
export const protocolEntrySchema = z.object({
    id: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),   // ISO date "2025-01-22"
    time: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Time must be in YYYY-MM-DDTHH:mm:ss format'),   // ISO datetime "2025-01-22T08:17:09"
    recordType: recordTypeSchema,
    locationType: locationTypeSchema,
    terminal: z.string(),
    notes: z.string().nullable(),
    isManual: z.boolean(),
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'CreatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'UpdatedAt must be in YYYY-MM-DDTHH:mm:ss format'),
});

// Helper function to convert backend TimeRecordResponse to frontend ProtocolEntry
export const convertTimeRecordToProtocolEntry = (record: TimeRecordResponse): ProtocolEntry => {
    return {
        id: record.id,
        date: record.recordDate, // Backend sends "2025-01-22"
        time: record.recordTime, // Backend sends "2025-01-22T08:17:09.123"
        recordType: record.recordType,
        locationType: record.locationType,
        terminal: 'Web Terminal',
        notes: record.notes || '',
        isManual: record.isManual,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
};

// Helper function to convert ProtocolEntry to display format
export const formatProtocolEntryForDisplay = (entry: ProtocolEntry) => {
    // Parse the ISO datetime string to create proper Date object
    const entryDateTime = new Date(entry.time);

    // Format for German locale display
    const displayDate = entryDateTime.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }); // "22.01.2025"

    const displayTime = entryDateTime.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }); // "08:17:09"

    return {
        ...entry,
        displayDate,
        displayTime,
        displayBooking: getBookingDisplay(entry.recordType, entry.locationType),
        displayBookingType: getBookingType(entry.recordType),
    };
};

// Helper function to get booking display text
const getBookingDisplay = (recordType: string, locationType: string): string => {
    const locationSuffix = locationType === 'HOME' ? ' (Home)' :
        locationType === 'BUSINESS_TRIP' ? ' (Trip)' :
            locationType === 'CLIENT_SITE' ? ' (Client)' : '';

    const typeMap = {
        'CLOCK_IN': `A0 Arrival${locationSuffix}`,
        'CLOCK_OUT': 'C0 Departure',
        'BREAK_START': 'B1 Break Start',
        'BREAK_END': 'B2 Break End'
    };

    return typeMap[recordType as keyof typeof typeMap] || recordType;
};

// Helper function to get booking type for chip styling
const getBookingType = (recordType: string): string => {
    const typeMap = {
        'CLOCK_IN': 'arrival',
        'CLOCK_OUT': 'departure',
        'BREAK_START': 'break',
        'BREAK_END': 'break'
    };

    return typeMap[recordType as keyof typeof typeMap] || 'default';
};

// Type inference from schemas
export type ProtocolEntry = z.infer<typeof protocolEntrySchema>;

// Re-export TimeRecordResponse type
export type { TimeRecordResponse } from './timetrackSchemas';
