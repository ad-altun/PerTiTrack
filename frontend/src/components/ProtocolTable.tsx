import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import ProtocolWorkSummary from "./ProtocolWorkSummary.tsx";
import { useEffect, useState } from "react";
import {
    useDeleteTimeRecordMutation,
    useGetTimeRecordsByDateQuery,
} from "../store/api/timetrackApi.ts";
import {
    convertTimeRecordToProtocolEntry,
    formatProtocolEntryForDisplay,
    type ProtocolEntry
} from "../validation/protocolEntrySchema.ts";
import ProtocolFilters from "./ProtocolFilters.tsx";

interface FormattedProtocolEntry extends ProtocolEntry {
    displayDate: string;
    displayTime: string;
    displayBooking: string;
    displayBookingType: string;
}

export default function ProtocolTable() {
    const today = new Date().toISOString().slice(0, 10);
    const [ selectedDate, setSelectedDate ] = useState<string>(today);

    const {
        data: dateRecords,
        isLoading: isRecordLoading,
        isFetching,
        error,
        refetch,
    } = useGetTimeRecordsByDateQuery(selectedDate);

    const [ deleteTimeRecord, { isLoading: isDeleting } ] = useDeleteTimeRecordMutation();

    const [ protocols, setProtocols ] = useState<FormattedProtocolEntry[]>([]);
    const [ newRecordId, setNewRecordId ] = useState<string | null>(null);
    const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
    const [ recordToDelete, setRecordToDelete ] = useState<FormattedProtocolEntry | null>(null);

    const handleDateChange = ( date: string ) => {
        setSelectedDate(date);
    };

    // Convert backend records to frontend ProtocolEntry
    // format and update protocols when data changes
    useEffect(() => {
        if ( dateRecords ) {
            const protocolEntries = dateRecords.map(convertTimeRecordToProtocolEntry);
            const formattedEntries = protocolEntries
                .map(formatProtocolEntryForDisplay)
                .sort(( a, b ) => new Date(a.time).getTime() - new Date(b.time).getTime()); // Oldest first (newest at bottom)

            setProtocols(prevProtocols => {
                // Check for new records by comparing with previous state
                if ( formattedEntries.length > 0 ) {
                    const latestRecord = formattedEntries[ formattedEntries.length - 1 ]; // Last in array (newest)
                    const isNewRecord = !prevProtocols.find(p => p.id === latestRecord.id);
                    if ( isNewRecord ) {
                        setNewRecordId(latestRecord.id);
                    }
                }
                return formattedEntries;
            });
        }
    }, [ dateRecords ]);

    // Auto-refetch when new actions are performed
    useEffect(() => {
        const handleStorageChange = () => {
            refetch();
        };

        // Listen for custom events from action buttons
        window.addEventListener('timeRecordUpdated', handleStorageChange);
        return () => window.removeEventListener('timeRecordUpdated', handleStorageChange);
    }, [ refetch ]);

    const getBookingChipColor = ( bookingType: string ) => {
        switch ( bookingType ) {
            case 'arrival':
                return { backgroundColor: '#c6f6d5', color: '#22543d' }; // Green
            case 'break':
                return { backgroundColor: '#fed7d7', color: '#742a2a' }; // Red
            case 'departure':
                return { backgroundColor: '#bee3f8', color: '#2a4365' }; // Blue
            default:
                return { backgroundColor: '#e2e8f0', color: '#2d3748' }; // Gray
        }
    };

    const handleNotesUpdate = ( recordId: string ) => {
        // Clear new record flag after notes are updated
        if ( newRecordId === recordId ) {
            setNewRecordId(null);
        }
    };

    // Handle Ctrl+Click delete functionality
    const handleRowClick = ( event: React.MouseEvent, protocol: FormattedProtocolEntry ) => {
        // Only proceed if Ctrl (or Cmd on Mac) is held down
        if ( event.ctrlKey || event.metaKey ) {
            event.preventDefault();
            event.stopPropagation();
            setRecordToDelete(protocol);
            setDeleteDialogOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if ( recordToDelete ) {
            try {
                await deleteTimeRecord(recordToDelete.id).unwrap();
                setDeleteDialogOpen(false);
                setRecordToDelete(null);

                // Dispatch custom event to trigger refetch
                window.dispatchEvent(new Event('timeRecordUpdated'));

                // Optional: Show success feedback (you could use a toast library)
                console.log('Time record deleted successfully');
            }
            catch (error) {
                console.error('Failed to delete time record:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
    };

    if ( isRecordLoading && !protocols.length ) {
        return (
            <>
                <ProtocolFilters onDateChange={ handleDateChange } isRecordLoading={ true }/>
                <Box display="flex" justifyContent="center" p={ 4 }>
                    <CircularProgress/>
                </Box>
            </>
        );
    }

    return (
        <>
            <Box
                sx={ {
                    backgroundColor: 'background.cardSection',
                    width: '100%',
                    borderBottom: '2px solid', borderColor: 'border.main',
                } }
            >
                {/* Protocol Filters */ }
                <ProtocolFilters onDateChange={ handleDateChange } isRecordLoading={ isFetching }/>
            </Box>

            {/* Table Container with Loading Overlay */ }
            <Box sx={ {
                backgroundColor: 'background.cardSection',
                position: 'relative',
            } }>
                {/* Loading Overlay - shown during date changes */ }
                { isFetching && protocols.length > 0 && (
                    <Box
                        sx={ {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(2px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            borderRadius: '4px',
                        } }
                    >
                        <Box
                            sx={ {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                backgroundColor: 'background.cardSection',
                                padding: 3,
                                borderRadius: 2,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            } }
                        >
                            <CircularProgress size={ 40 }/>
                            <Typography variant="body2" color="text.secondary">
                                Loading records...
                            </Typography>
                        </Box>
                    </Box>
                ) }
                <TableContainer>
                    <Table sx={ { minWidth: 650 } }>
                        <TableHead
                            sx={ {
                                // borderTop: '1px solid',
                                // borderColor: 'border.light',
                            } }
                        >
                            <TableRow>
                                { [ 'Date', 'Time', 'Booking', 'Terminal', 'Work Summary' ].map(( header ) => (
                                    <TableCell
                                        key={ header }
                                        sx={ {
                                            // backgroundColor: 'navItem.text',
                                            backgroundColor: 'background.cardSection',
                                            // backgroundColor: 'background.default',
                                            padding: '12px 18px',
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            fontSize: '14px',
                                            borderBottom: '1px solid #e2e8f0',
                                        } }
                                    >
                                        { header }:
                                    </TableCell>
                                )) }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { error ?
                                (
                                    <>
                                        <Alert severity="error"
                                               sx={ {
                                                   display: 'flex',
                                                   justifyContent: 'center',
                                                   alignItems: 'center',
                                                   width: '100%',
                                                   marginBlock: 2 ,
                                                   marginInline: '50%',
                                                   padding: 1,
                                               } }>
                                            <Typography
                                                variant="body1"
                                                sx={{ paddingBlock: .5, }}
                                            >
                                                Failed to load today's time records. Please try again.
                                            </Typography>
                                        </Alert>
                                    </>
                                ) : (
                                    protocols.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={ 5 } sx={ { textAlign: 'center', py: 4 } }>
                                                <Typography variant="body2" color="text.secondary">
                                                    No time records for today yet. Start by clocking in!
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        protocols.map(( protocol, index ) => (
                                            <TableRow
                                                key={ protocol.id }
                                                onClick={ ( event ) => handleRowClick(event, protocol) }
                                                sx={ {
                                                    backgroundColor: index % 2 === 0 ? 'white' : '#f7fafc',
                                                    '&:hover': {
                                                        backgroundColor: '#edf2f7',
                                                        cursor: 'pointer',
                                                    },
                                                    // Visual indicator for Ctrl+Click functionality
                                                    '&:hover::after': {
                                                        // content: '"Ctrl+Click to delete"',
                                                        position: 'absolute',
                                                        right: '8px',
                                                        fontSize: '11px',
                                                        color: '#666',
                                                        pointerEvents: 'none',
                                                    },
                                                    position: 'relative',
                                                } }
                                            >
                                                <TableCell
                                                    sx={ {
                                                        padding: '8px',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        color: '#4a5568',
                                                        fontSize: '13px',
                                                    } }
                                                >
                                                    { protocol.displayDate }
                                                </TableCell>
                                                <TableCell
                                                    sx={ {
                                                        padding: '8px',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        color: '#4a5568',
                                                        fontSize: '13px',
                                                        fontFamily: 'monospace',
                                                    } }
                                                >
                                                    { protocol.displayTime }
                                                </TableCell>
                                                <TableCell
                                                    sx={ {
                                                        padding: '8px',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        fontSize: '13px',
                                                    } }
                                                >
                                                    <Chip
                                                        label={ protocol.displayBooking }
                                                        size="small"
                                                        sx={ {
                                                            ...getBookingChipColor(protocol.displayBookingType),
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            height: '24px',
                                                        } }
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={ {
                                                        padding: '8px',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        color: '#4a5568',
                                                        fontSize: '13px',
                                                    } }
                                                >
                                                    { protocol.terminal }
                                                </TableCell>
                                                <TableCell
                                                    sx={ {
                                                        padding: '8px',
                                                        borderBottom: '1px solid #e2e8f0',
                                                        fontSize: '13px',
                                                        maxWidth: '300px',
                                                    } }
                                                    onClick={ ( e ) => e.stopPropagation() } // Prevent row click when clicking on work summary
                                                >
                                                    <ProtocolWorkSummary
                                                        id={ protocol.id }
                                                        workSummary={ protocol.notes }
                                                        isNewRecord={ newRecordId === protocol.id }
                                                        onNotesUpdate={ () => handleNotesUpdate(protocol.id) }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )) )
                                ) }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Delete Confirmation Dialog */ }
            <Dialog
                open={ deleteDialogOpen }
                onClose={ handleDeleteCancel }
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Time Record
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description">
                        Are you sure you want to delete this time record?
                    </Typography>
                    { recordToDelete && (
                        <Box sx={ { mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 } }>
                            <Typography variant="body2">
                                <strong>Date:</strong> { recordToDelete.displayDate }
                            </Typography>
                            <Typography variant="body2">
                                <strong>Time:</strong> { recordToDelete.displayTime }
                            </Typography>
                            <Typography variant="body2">
                                <strong>Type:</strong> { recordToDelete.displayBooking }
                            </Typography>
                            { recordToDelete.notes && (
                                <Typography variant="body2">
                                    <strong>Notes:</strong> { recordToDelete.notes }
                                </Typography>
                            ) }
                        </Box>
                    ) }
                    <Typography variant="body2" color="text.secondary" sx={ { mt: 2 } }>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleDeleteCancel } color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={ handleDeleteConfirm }
                        color="error"
                        variant="contained"
                        disabled={ isDeleting }
                    >
                        { isDeleting ? 'Deleting...' : 'Delete' }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
