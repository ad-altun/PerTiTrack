import { useState } from "react";
import { useAppDispatch, useAppSelector} from "../../store/hook.ts";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { type ActionButtonsProps, actionButtonsSchema, type ActionType } from "../../validation/actionButtonsSchema.ts";
import {
    clockIn,
} from "../../store/slices/timeTrackSlice.ts";

import {
    useQuickClockInMutation,
} from '../../store/api/timetrackApi.ts'



export default function ActionButton({ onActionComplete}: ActionButtonsProps) {
    const dispatch = useAppDispatch();
    const { currentStatus, todaySummary, isLoading } = useAppSelector(
        (state) => state.timeTrack
    );

    // RTK Query mutations
    const [quickClockIn, { isLoading: isClockingIn}] = useQuickClockInMutation();
    
    // Local State
    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    
    // helper Functions to handle API errors
    // const handleApiError = (error: never, defaultMessage: string) => {
    //     const message = error?.data?.message ||error?.message ||defaultMessage;
    //     setErrorMessage(message);
    //     setShowError(true);
    //     dispatch(setError(message));
    // }

    const handleClockIn = async () => {
        try {
            // update redux state immediately for UI responsiveness
            dispatch(clockIn({locationType: 'OFFICE', notes: 'Clocked in from office'}));

            // make API call
            await quickClockIn({
                recordType: 'CLOCK_IN',
                notes: 'Clocked in from office',
                locationType: 'OFFICE',
            }).unwrap();

            onActionComplete('clockIn');
        } catch (error) {
            // handleApiError(error, 'Failed to clock in.');
            console.log("Failed to clock in.");
        }
    }

    const handleClockOut = async () => {
        console.log("handle clock out.");
    }

    const handleBreakStart = async () => {
        console.log("handle break start.");
    }

    const handleBreakEnd = async () => {
        console.log("handle break end.");
    }

    const handleHomeOffice = async () => {
        console.log("handle home office.");
    }
    const handleBusinessTrip = async () => {
        console.log("handle business trip.");
    }

    // Determine which actions are available based on current status
    const getAvailableActions = () => {
        const actions = [];

        if (currentStatus === 'Not Started' || currentStatus === 'Finished') {
            actions.push({
                id: 'clockIn' as ActionType,
                // icon: <AccessTime />,
                icon: <Login sx={{ fontSize: 18 }} />,
                label: 'Clock In',
                onClick: handleClockIn,
                isLoading: isClockingIn,
                disabled: false,
            });
        }

        if ( currentStatus === 'Working' ) {
            actions.push(
                {
                    id: 'clockOut' as ActionType,
                    icon: <Logout sx={{ fontSize: 18 }} />,
                    label: 'Clock Out',
                    onclick: handleClockOut,
                    isLoading: isClockingIn,
                    disabled: false,
                },
                {
                    id: 'break' as ActionType,
                    icon: <AccessTime sx={{ fontSize: 18 }} />,
                    label: 'Start Break',
                    onClick: handleBreakStart,
                    isLoading: isClockingIn,
                    disabled: false,
                },
            )
        }

        if (currentStatus === 'Break') {
            actions.push(
                {
                    id: 'endBreak' as ActionType,
                    icon: <AccessTime sx={{ fontSize: 18 }} />,
                    label: 'End Break',
                    onClick: handleBreakEnd,
                    // isLoading: isEndingBreak,
                    disabled: false,
                },
                {
                    id: 'clockOut' as ActionType,
                    icon: <Logout sx={{ fontSize: 18 }} />,
                    label: 'Clock Out',
                    onClick: handleClockOut,
                    // isLoading: isClockingOut,
                    disabled: false,
                }
            );
        }
        // Location actions - always available when working or not started
        if (currentStatus !== 'Finished') {
            actions.push(
                {
                    id: 'homeOffice' as ActionType,
                    icon: <Home sx={{ fontSize: 18 }} />,
                    label: 'Home Office',
                    onClick: handleHomeOffice,
                    // isLoading: isClockingInHome,
                    disabled: false,
                },
                {
                    id: 'businessTrip' as ActionType,
                    icon: <Flight sx={{ fontSize: 18 }} />,
                    label: 'Business Trip',
                    onClick: handleBusinessTrip,
                    // isLoading: isClockingInBusinessTrip,
                    disabled: false,
                }
            );
        }

        return actions;
    }

    const  availableActions = getAvailableActions();

 return (
     <>
         <Box
             sx={{
                 display: 'grid',
                 gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                 gap: '1rem',
                 marginBottom: '1rem',
             }}
         >
             {availableActions.map((action) => (
                 <Box
                     key={action.id}
                     onClick={action.disabled ? undefined : action.onClick}
                     sx={{
                         padding: '1rem',
                         textAlign: 'center',
                         border: '2px solid',
                         borderColor: action.disabled ? '#cbd5e0' : '#e2e8f0',
                         borderRadius: '8px',
                         cursor: action.disabled ? 'not-allowed' : 'pointer',
                         backgroundColor: action.disabled ? '#f7fafc' : 'white',
                         color: action.disabled ? '#a0aec0' : '#2d3748',
                         transition: 'all 0.3s ease',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '10px',
                         position: 'relative',
                         opacity: action.disabled ? 0.6 : 1,
                         '&:hover': action.disabled ? {} : {
                             borderColor: '#e53e3e',
                             backgroundColor: '#fef5f5',
                             transform: 'translateY(-2px)',
                             boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                         },
                     }}
                 >
                     {/* Loading Overlay */}
                     {action.isLoading && (
                         <Box
                             sx={{
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
                             }}
                         >
                             <CircularProgress size={24} color="primary" />
                         </Box>
                     )}

                     {/* Icon Container */}
                     <Box
                         sx={{
                             width: '48px',
                             height: '48px',
                             borderRadius: '50%',
                             backgroundColor: action.disabled ? '#e2e8f0' : '#f7fafc',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             color: action.disabled ? '#a0aec0' : '#4a5568',
                             marginBottom: '8px',
                         }}
                     >
                         {action.icon}
                     </Box>

                     {/* Label */}
                     <Typography
                         variant="body2"
                         sx={{
                             fontWeight: 600,
                             fontSize: '0.9rem',
                             textAlign: 'center',
                             lineHeight: 1.2,
                         }}
                     >
                         {action.isLoading ? 'Processing...' : action.label}
                     </Typography>

                     {/* Status Indicator */}
                     {action.id === 'clockIn' && todaySummary.isWorking && (
                         <Box
                             sx={{
                                 position: 'absolute',
                                 top: '8px',
                                 right: '8px',
                                 width: '12px',
                                 height: '12px',
                                 borderRadius: '50%',
                                 backgroundColor: '#48bb78',
                                 animation: 'pulse 2s infinite',
                             }}
                         />
                     )}

                     {action.id === 'break' && todaySummary.isOnBreak && (
                         <Box
                             sx={{
                                 position: 'absolute',
                                 top: '8px',
                                 right: '8px',
                                 width: '12px',
                                 height: '12px',
                                 borderRadius: '50%',
                                 backgroundColor: '#ed8936',
                                 animation: 'pulse 2s infinite',
                             }}
                         />
                     )}
                 </Box>
             ))}
         </Box>

         {/* Current Status Display */}
         <Box
             sx={{
                 backgroundColor: '#f7fafc',
                 padding: '12px 16px',
                 borderRadius: '8px',
                 border: '1px solid #e2e8f0',
                 marginBottom: '1rem',
             }}
         >
             <Typography
                 variant="body2"
                 sx={{
                     color: '#4a5568',
                     textAlign: 'center',
                     fontWeight: 500,
                 }}
             >
                 Current Status: {' '}
                 <Typography
                     component="span"
                     sx={{
                         color: currentStatus === 'Working' ? '#38a169' :
                             currentStatus === 'Break' ? '#ed8936' :
                                 currentStatus === 'Finished' ? '#e53e3e' : '#718096',
                         fontWeight: 600,
                     }}
                 >
                     {currentStatus}
                 </Typography>
             </Typography>

             {todaySummary.arrivalTime && (
                 <Typography
                     variant="caption"
                     sx={{
                         color: '#718096',
                         textAlign: 'center',
                         display: 'block',
                         marginTop: '4px',
                     }}
                 >
                     Started at {todaySummary.arrivalTime}
                 </Typography>
             )}
         </Box>

         {/* Error Snackbar */}
         <Snackbar
             open={showError}
             autoHideDuration={6000}
             onClose={() => setShowError(false)}
             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
         >
             <Alert
                 onClose={() => setShowError(false)}
                 severity="error"
                 sx={{ width: '100%' }}
             >
                 {errorMessage}
             </Alert>
         </Snackbar>

         {/* Custom CSS for pulse animation */}
         <style>
             {`
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
        `}
         </style>
     </>
 );
};
