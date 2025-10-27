import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook.ts";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
    AccessTime,
    Home,
    Flight,
    Login,
    Logout
} from '@mui/icons-material';
import { type ActionButtonsProps, type ActionType } from "../../validation/actionButtonsSchema.ts";
import {
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    changeLocationType,
    setError
} from "../../store/slices/timeTrackSlice.ts";

import {
    useQuickClockInMutation,
    useQuickClockOutMutation,
    useQuickBreakStartMutation,
    useQuickBreakEndMutation,
    useClockInHomeMutation,
    useClockInBusinessTripMutation,
} from '../../store/api/timetrackApi.ts';
import { useCurrentWorkingStatus } from "../../hooks/useCurrentWorkingStatus.ts";
import { Typography } from "@mui/material";

export default function ActionButton( { onActionComplete }: ActionButtonsProps ) {
    const dispatch = useAppDispatch();
    const { todaySummary, isLoading } = useAppSelector(
        ( state ) => state.timeTrack
    );

    const { currentStatus } = useCurrentWorkingStatus();


    // RTK Query mutations
    const [ quickClockIn, { isLoading: isClockingIn } ] = useQuickClockInMutation();
    const [ quickClockOut, { isLoading: isClockingOut } ] = useQuickClockOutMutation();
    const [ quickBreakStart, { isLoading: isStartingBreak } ] = useQuickBreakStartMutation();
    const [ quickBreakEnd, { isLoading: isEndingBreak } ] = useQuickBreakEndMutation();
    const [ clockInHome, { isLoading: isClockingInHome } ] = useClockInHomeMutation();
    const [ clockInBusinessTrip, { isLoading: isClockingInBusinessTrip } ] = useClockInBusinessTripMutation();

    // Local State
    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    // helper Functions to handle API errors
    const handleApiError = (
        defaultMessage: string ) => {
        const message = defaultMessage;
        console.log(message);

        setErrorMessage(message);
        setShowError(true);
        dispatch(setError(message));
    };

    const handleClockIn = async () => {
        try {
            // Make API call first (this will invalidate cache automatically via invalidatesTags)
            await quickClockIn({
                recordType: 'CLOCK_IN',
                notes: 'Clocked in from office',
                locationType: 'OFFICE',
            }).unwrap();

            // update redux state immediately for UI responsiveness
            dispatch(clockIn({ locationType: 'OFFICE', notes: 'Clocked in from office' }));

            // Force a small delay to ensure cache has been invalidated
            setTimeout(() => {
                onActionComplete('CLOCK_IN');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to clock in');
        }
    };

    const handleClockOut = async () => {
        try {
            await quickClockOut({
                notes: 'Clock out'
            }).unwrap();

            dispatch(clockOut({ notes: 'Clock out' }));

            setTimeout(() => {
                onActionComplete?.('CLOCK_OUT');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to clock out');
        }
    };

    const handleBreakStart = async () => {
        try {
            await quickBreakStart({
                notes: 'Break started',
            }).unwrap();

            dispatch(startBreak({ notes: 'Started break' }));

            setTimeout(() => {
                onActionComplete?.('BREAK_START');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to start break');
        }
    };

    const handleBreakEnd = async () => {
        try {
            await quickBreakEnd({
                notes: 'Break ended',
            }).unwrap();

            dispatch(endBreak({ notes: 'Break ended' }));

            setTimeout(() => {
                onActionComplete?.('BREAK_END');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to end break');
        }
    };

    const handleHomeOffice = async () => {
        try {
            await clockInHome({
                notes: 'Clocked in from home',
            }).unwrap();

            dispatch(changeLocationType({
                locationType: 'HOME',
                notes: 'Clocked in from home'
            }));

            setTimeout(() => {
                onActionComplete('HOME');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to clock in from home');
        }
    };

    const handleBusinessTrip = async () => {
        try {
            await clockInBusinessTrip({
                notes: 'Business trip'
            }).unwrap();

            dispatch(changeLocationType({
                locationType: 'BUSINESS_TRIP',
                notes: 'Business trip'
            }));

            setTimeout(() => {
                onActionComplete?.('BUSINESS_TRIP');
            }, 100);
        }
        catch (error) {
            handleApiError('Failed to clock in from business trip');
        }
    };

    // Determine which actions are available based on current status
    const getAvailableActions = () => {
        const actions = [];

        // if ( currentStatus === 'Not Started' || currentStatus === 'Finished' ) {
        if ( !currentStatus?.isWorking && !currentStatus?.isOnBreak ) {
            actions.push({
                id: 'CLOCK_IN' as ActionType,
                icon: <Login sx={ { fontSize: 18 } }/>,
                label: 'Clock In',
                onClick: handleClockIn,
                isLoading: isClockingIn,
                disabled: false,
            });

            // Location-specific clock in options (only when completely clocked out)
            actions.push(
                {
                    id: 'HOME' as ActionType,
                    icon: <Home sx={ { fontSize: 18 } }/>,
                    label: 'Home Office',
                    onClick: handleHomeOffice,
                    isLoading: isClockingInHome,
                    disabled: false,
                },
                {
                    id: 'BUSINESS_TRIP' as ActionType,
                    icon: <Flight sx={ { fontSize: 18 } }/>,
                    label: 'Business Trip',
                    onClick: handleBusinessTrip,
                    isLoading: isClockingInBusinessTrip,
                    disabled: false,
                }
            );
        }

        // if ( currentStatus === 'Working' ) {
        if ( currentStatus?.isWorking && !currentStatus?.isOnBreak ) {
            actions.push(
                {
                    id: 'CLOCK_OUT' as ActionType,
                    icon: <Logout sx={ { fontSize: 18 } }/>,
                    label: 'Clock Out',
                    onClick: handleClockOut,
                    isLoading: isClockingOut,
                    disabled: false,
                },
                {
                    id: 'BREAK_START' as ActionType,
                    icon: <AccessTime sx={ { fontSize: 18 } }/>,
                    label: 'Start Break',
                    onClick: handleBreakStart,
                    isLoading: isStartingBreak,
                    disabled: false,
                },
            );
        }

        // if ( currentStatus === 'Break' ) {
        if ( currentStatus?.isOnBreak ) {
            actions.push(
                {
                    id: 'BREAK_END' as ActionType,
                    icon: <AccessTime sx={ { fontSize: 18 } }/>,
                    label: 'End Break',
                    onClick: handleBreakEnd,
                    isLoading: isEndingBreak,
                    disabled: false,
                },
                {
                    id: 'CLOCK_OUT' as ActionType,
                    icon: <Logout sx={ { fontSize: 18 } }/>,
                    label: 'Clock Out',
                    onClick: handleClockOut,
                    isLoading: isClockingOut,
                    disabled: false,
                }
            );
        }

        return actions;
    };

    const availableActions = getAvailableActions();

    return (
        <>
            <Box
                sx={ {
                    // display: 'grid',
                    // gridTemplateColumns: 'repeat(100px, minmax(10px, 3fr))',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'noWrap',
                    marginBottom: '1rem',
                    backgroundColor: 'background.cardItem',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    width: '100%',
                } }
            >
                { availableActions.map(( action, index ) => (
                    <Box
                        key={ index }
                        onClick={ action.disabled ? undefined : action.onClick }
                        sx={ {
                            padding: '.75rem',
                            textAlign: 'center',
                            border: '2px solid',
                            borderColor: action.disabled ? '#cbd5e0' : '#3b82f6',
                            borderRadius: '8px',
                            cursor: action.disabled ? 'not-allowed' : 'pointer',
                            backgroundColor: action.disabled ? '#f7fafc' : 'white',
                            color: action.disabled ? '#a0aec0' : '#2d3748',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '.5rem',
                            width: '100%',
                            position: 'relative',
                            opacity: action.disabled ? 0.6 : 1,
                            '&:hover': action.disabled ? {} : {
                                borderColor: '#e53e3e',
                                backgroundColor: '#fef5f5',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                        } }
                    >
                        {/* Loading Overlay */ }
                        { action.isLoading && (
                            <Box
                                sx={ {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    zIndex: 1,
                                } }
                            >
                                <CircularProgress size={ 24 } color="primary"/>
                            </Box>
                        ) }

                        {/* Icon Container */ }
                        <Box
                            sx={ {
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: action.disabled ? '#e2e8f0' : '#f7fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: action.disabled ? '#a0aec0' : '#4a5568',
                                marginBottom: '8px',
                            } }
                        >
                            { action.icon }
                        </Box>

                        {/* Label */ }
                        <Typography
                            variant="body2"
                            sx={ {
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                lineHeight: 1.2,
                            } }
                        >
                            { action.isLoading ? 'Processing...' : action.label }
                        </Typography>

                        {/* Status Indicator */ }
                        { action.id === 'CLOCK_IN' && todaySummary.isWorking && (
                            <Box
                                sx={ {
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: '#48bb78',
                                    animation: 'pulse 2s infinite',
                                } }
                            />
                        ) }

                        { action.id === 'BREAK_START' && todaySummary.isOnBreak && (
                            <Box
                                sx={ {
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ed8936',
                                    animation: 'pulse 2s infinite',
                                } }
                            />
                        ) }
                    </Box>
                )) }
            </Box>

            {/* Current Status Display */ }
            <Box
                sx={ {
                    backgroundColor: 'background.cardItem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '.1rem',
                } }
            >
                <Typography
                    variant="body2"
                    sx={ {
                        color: '#4a5568',
                        textAlign: 'center',
                        fontWeight: 500,
                    } }
                >
                    Current Status: { ' ' }
                    <Typography
                        component="span"
                        sx={ {
                            color: currentStatus?.isWorking ? '#38a169' :
                                currentStatus?.isOnBreak ? '#ed8936' :
                                    !currentStatus?.isWorking ? '#718096' : '#718096',
                            fontWeight: 600,
                        } }
                    >
                        { currentStatus?.isWorking ? 'Working' :
                            currentStatus?.isOnBreak ? 'Break' : 'Not Working' }
                    </Typography>
                </Typography>

                { todaySummary.arrivalTime && (
                    <Typography
                        variant="caption"
                        sx={ {
                            color: '#718096',
                            textAlign: 'center',
                            display: 'block',
                            marginTop: '4px',
                        } }
                    >
                    </Typography>
                ) }
            </Box>

            {/* Error Snackbar */ }
            <Snackbar
                open={ showError }
                autoHideDuration={ 6000 }
                onClose={ () => setShowError(false) }
                anchorOrigin={ { vertical: 'bottom', horizontal: 'center' } }
            >
                <Alert
                    onClose={ () => setShowError(false) }
                    severity="error"
                    sx={ { width: '100%' } }
                >
                    { errorMessage }
                </Alert>
            </Snackbar>

            {/* Custom CSS for pulse animation */ }
            <style>
                { `
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
            }
          }
        ` }
            </style>
        </>
    );
};
