import React, { useState } from 'react';
import { useAppSelector } from "../../store/hook.ts";
import ActionButton from "./ActionButton.tsx";
import WorkflowButtonGroup from "./WorkflowButtonGroup.tsx";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Alert, Box, Paper } from "@mui/material";
import { selectIsStatusLoading } from "../../store/selectors/timeTrackSelectors.ts";
import Snackbar from "@mui/material/Snackbar";
import { useGetCurrentStatusQuery, useGetTodayTimeRecordsQuery } from "../../store/api/timetrackApi.ts";
import { useDynamicLocalTime } from "../../hooks/useDynamicLocalTime.ts";
import { useGetLastBookingType } from "../../hooks/useGetLastBookingType.ts";

const BookingPanel: React.FC = () => {
    const dynamicLocalTime = useDynamicLocalTime();
    const isStatusLoading = useAppSelector(selectIsStatusLoading);

// local state for notification
    const [ showSuccess, setShowSuccess ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('');

    // API calls with proper error handling
    const {
        data: currentStatus,
        isLoading: isCurrentStatusLoading,
        error: currentStatusError
    } = useGetCurrentStatusQuery();

    const {
        data: todayRecords,
        isLoading: isTodayRecordsLoading,
        error: todayRecordsError
    } = useGetTodayTimeRecordsQuery();

    const handleActionComplete = ( action: string ) => {
        const messages = {
            CLOCK_IN: 'Successfully clocked in!',
            CLOCK_OUT: 'Successfully clocked out!',
            BREAK_START: 'Break started successfully!',
            BREAK_END: 'Break ended successfully!',
            HOME: 'Home office work started!',
            BUSINESS_TRIP: 'Business trip work started!',
        };

        setSuccessMessage(messages[ action as keyof typeof messages ] || 'Action completed!');
        setShowSuccess(true);
    };

    // Handle workflow actions
    const handleWorkflowClick = () => {
        console.log('Workflow clicked - Open workflow management');
        // TODO: Implement workflow management, open modal
    };

    const handleBalanceClick = () => {
        console.log('Balance clicked - Open balance view');
        // TODO: Implement balance/flextime view
    };

    const localDate = new Date().toISOString().slice(0, 10);
    const localTime = dynamicLocalTime;

    const lastBookingType = useGetLastBookingType();
    const lastBookingTypeText = {
        CLOCK_IN: 'Clocked in',
        CLOCK_OUT: 'Clocked out',
        BREAK_START: 'Break started',
        BREAK_END: 'Break ended',
        HOME: 'Home office work started',
        BUSINESS_TRIP: 'Business trip work started',
    };

    // Show loading state while data is being fetched
    const isDataLoading = isCurrentStatusLoading || isTodayRecordsLoading || isStatusLoading;

    // Display the error state if needed
    if ( currentStatusError || todayRecordsError ) {
        console.error('BookingPanel API errors:', { currentStatusError, todayRecordsError });
    }

    return (
        <>
            <Paper
                elevation={ 2 }
                sx={ {
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '20px',
                } }
            >
                {/* Section Header */ }
                <Box
                    sx={ {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    } }
                >
                    <Typography variant="h6" component="div" sx={ { fontWeight: 600 } }>
                        Quick Actions
                    </Typography>

                    {/*{ !isDataLoading && currentStatus && (*/ }
                    {/*    <Typography variant="body2" sx={ { opacity: 0.9 } }>*/ }
                    {/*        Status: { currentStatus.isWorking ? 'Working' :*/ }
                    {/*        currentStatus.isOnBreak ? 'On Break' : 'Not Working' }*/ }
                    {/*    </Typography>*/ }
                    {/*) }*/ }
                </Box>

                {/* Current Info Section */ }
                <Box
                    sx={ {
                        backgroundColor: '#f8fafc',
                        padding: '20px',
                        borderBottom: '1px solid #e2e8f0',
                    } }
                >
                    <Typography
                        variant="subtitle2"
                        sx={ {
                            fontWeight: 600,
                            color: '#4a5568',
                            marginBottom: '12px',
                        } }
                    >
                        Current Information
                    </Typography>

                    {/* Info Grid */ }
                    <Box
                        sx={ {
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: '12px',
                        } }
                    >
                        { [
                            { label: 'Local Date', value: localDate },
                            { label: 'Local Time', value: localTime },
                            {
                                label: 'Last Booking',
                                value: isDataLoading ? 'Loading...' : lastBookingTypeText[ lastBookingType ],
                                isLoading: isDataLoading
                            },
                        ].map(( info, index ) => (
                            <Box
                                key={ index }
                                sx={ {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    opacity: info.isLoading ? 0.7 : 1,
                                } }
                            >
                                <Typography
                                    variant="caption"
                                    sx={ {
                                        fontWeight: 500,
                                        color: '#718096',
                                        fontSize: '0.75rem',
                                    } }
                                >
                                    { info.label }:
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={ {
                                        color: '#2d3748',
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        fontFamily: info.label.includes('Time') ? 'monospace' : 'inherit',
                                        fontStyle: info.isLoading ? 'italic' : 'normal',
                                    } }
                                >
                                    { info.value }
                                </Typography>
                            </Box>
                        )) }
                    </Box>
                </Box>

                {/* Action Buttons */ }
                <Box sx={ { padding: '24px' } }>
                    <ActionButton onActionComplete={ handleActionComplete }/>

                    <Divider sx={ { margin: '20px 0' } }/>

                    {/* Workflow Actions */ }
                    <Typography
                        variant="subtitle2"
                        sx={ {
                            fontWeight: 600,
                            color: '#4a5568',
                            marginBottom: '16px',
                        } }
                    >
                        Additional Actions
                    </Typography>

                    <WorkflowButtonGroup
                        onWorkflowClick={ handleWorkflowClick }
                        onBalanceClick={ handleBalanceClick }
                        activeButton={ null }
                        disabledButtons={ [] }
                    />
                </Box>
            </Paper>

            {/*todo: workflow management modal should be add this level*/ }

            {/* Success Notification */ }
            <Snackbar
                open={ showSuccess }
                autoHideDuration={ 4000 }
                onClose={ () => setShowSuccess(false) }
                anchorOrigin={ { vertical: 'bottom', horizontal: 'center' } }
            >
                <Alert
                    onClose={ () => setShowSuccess(false) }
                    severity="success"
                    sx={ { width: '100%' } }
                >
                    { successMessage }
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookingPanel;