import React, { useState } from 'react';
import { useAppSelector } from "../../store/hook.ts";
import ActionButton from "./ActionButton.tsx";
import WorkflowButtonGroup from "./WorkflowButtonGroup.tsx";
import {
    selectLocalTime,
    selectLocalDate,
    selectBookingType,
} from '../../store/selectors/bookingSelectors.ts';
import { useCurrentEmployee } from "../../hooks/useCurrentEmployee.ts";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Alert, Box, Paper } from "@mui/material";
import { selectCurrentStatus } from "../../store/selectors/timeTrackSelectors.ts";
import { useGetCurrentStatusQuery } from '../../store/api/timetrackApi.ts';
import Snackbar from "@mui/material/Snackbar";


const BookingPanel: React.FC = () => {

    const currentStatus = useAppSelector(selectCurrentStatus);
    const { data: apiStatus, isLoading: isStatusLoading } = useGetCurrentStatusQuery();

// local state for notificcation
    const [ showSuccess, setShowSuccess ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('');

    const handleActionComplete = (action: string) => {
        const messages = {
            clockIn: 'Successfully clocked in!',
            clockOut: 'Successfully clocked out!',
            break: 'Break started successfully!',
            endBreak: 'Break ended successfully!',
            homeOffice: 'Home office work started!',
            businessTrip: 'Business trip work started!',
        }

        setSuccessMessage(messages[action as keyof typeof messages] || 'Action completed!');
        setShowSuccess(true);
    }

    // Handle workflow actions
    const handleWorkflowClick = () => {
        console.log('Workflow clicked - Open workflow management');
        // TODO: Implement workflow management
    };

    const handleBalanceClick = () => {
        console.log('Balance clicked - Open balance view');
        // TODO: Implement balance/flextime view
    };

    const localDate = useAppSelector(selectLocalTime);
    const localTime = useAppSelector(selectLocalDate);
    // const bookingType = useAppSelector(selectBookingType);
    const { employeeName } = useCurrentEmployee();

    // current info from API or fallback values
    const currentInfo = {
        localDate,
        localTime,
        bookingType: apiStatus?.lastEntry ?
            `${apiStatus.lastEntry.recordType.replace('_', ' ')} - ${apiStatus.lastEntry.locationType}` :
            'No recent activity',
        employeeName,
    }

// const [quickClockIn, { isLoading, isSuccess, isError }] = useQuickClockInMutation();


    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '20px',
                }}
            >
                {/* Section Header */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Quick Actions
                    </Typography>

                    {!isStatusLoading && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Status: {currentStatus}
                        </Typography>
                    )}
                </Box>

                {/* Current Info Section */}
                <Box
                    sx={{
                        backgroundColor: '#f8fafc',
                        padding: '20px',
                        borderBottom: '1px solid #e2e8f0',
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            color: '#4a5568',
                            marginBottom: '12px',
                        }}
                    >
                        Current Information
                    </Typography>

                    {/* Info Grid */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: '12px',
                        }}
                    >
                        {[
                            { label: 'Local Date', value: currentInfo.localDate },
                            { label: 'Local Time', value: currentInfo.localTime },
                            { label: 'Last Booking', value: currentInfo.bookingType },
                        ].map((info, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 500,
                                        color: '#718096',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {info.label}:
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#2d3748',
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        fontFamily: info.label.includes('Time') ? 'monospace' : 'inherit',
                                    }}
                                >
                                    {info.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ padding: '24px' }}>
                    <ActionButton onActionComplete={handleActionComplete} />

                    <Divider sx={{ margin: '20px 0' }} />

                    {/* Workflow Actions */}
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            color: '#4a5568',
                            marginBottom: '16px',
                        }}
                    >
                        Additional Actions
                    </Typography>

                    <WorkflowButtonGroup
                        onWorkflowClick={handleWorkflowClick}
                        onBalanceClick={handleBalanceClick}
                        activeButton={null}
                        disabledButtons={[]}
                    />
                </Box>
            </Paper>

            {/* Success Notification */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={4000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
            </>
    );
};

export default BookingPanel;