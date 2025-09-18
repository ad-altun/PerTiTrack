import { Box, Grid, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../store/hook";
import {
    selectArrivalTime,
    selectBreakTime,
    selectWorkingTime,
    selectStatus,
    selectIsClockedIn,
    selectCurrentClockIn,
    selectFlexTime
} from "../../store/selectors/timeTrackSelectors.ts";

export default function TodaysSummary() {

    // get data from redux store
    const arrivalTime = useAppSelector(selectArrivalTime);
    const breakTime = useAppSelector(selectBreakTime);
    const workingTime = useAppSelector(selectWorkingTime);
    const flexTime = useAppSelector(selectFlexTime);
    const status = useAppSelector(selectStatus);
    const isClockedIn = useAppSelector(selectIsClockedIn);
    const currentClockInTime = useAppSelector(selectCurrentClockIn);


    const summaryItems = [
        {
            label: 'Arrival Time:',
            value: arrivalTime || '--:--:--',
            isHighlighted: !!arrivalTime
        },
        {
            label: 'Break Time:',
            value: breakTime
        },
        {
            label: 'Working Time:',
            value: workingTime
        },
        {
            label: 'Flex Time:',
            value: flexTime,
            isFlexTime: true
        },
        {
            label: 'Status:',
            value: status,
            isStatus: true
        },
    ];

    const getStatusColor = ( status: string ) => {
        switch ( status ) {
            case 'Working':
                return '#38a169'; // Green
            case 'On Break':
                return '#f6ad55'; // Orange
            case 'Finished':
                return '#4299e1'; // Blue
            case 'Not Started':
            default:
                return '#a0aec0'; // Gray
        }
    };

    return (
        <Paper
            elevation={ 2 }
            sx={ {
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                marginBottom: '20px',
            } }
        >
            {/* Section Header */ }
            <Box
                sx={ {
                    backgroundColor: '#e2e8f0',
                    padding: '15px 20px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    borderBottom: '1px solid #cbd5e0',
                } }
            >
                <Typography variant="h6" component="div" sx={ { fontWeight: 'bold' } }>
                    Today's Summary
                </Typography>
            </Box>

            {/* Summary Content */ }
            <Box sx={ { padding: '20px' } }>
                <Grid container spacing={ 2 }>
                    { summaryItems.map(( item, index ) => (
                        <Grid size={ { xs: 12, sm: 6, md: 12 } } key={ index }>
                            <Box
                                sx={ {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    backgroundColor: '#f7fafc',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    marginBottom: index < summaryItems.length - 1 ? '8px' : 0,
                                } }
                            >
                                <Typography
                                    variant="body2"
                                    sx={ {
                                        fontWeight: 600,
                                        color: '#4a5568',
                                        fontSize: '14px',
                                    } }
                                >
                                    { item.label }
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={ {
                                        color: item.isFlexTime
                                            ? ( item.value.startsWith('+') ? '#38a169' : '#e53e3e' )
                                            : item.isHighlighted
                                                ? '#2d3748'
                                                : '#2d3748',
                                        fontWeight: item.isFlexTime || item.isStatus || item.isHighlighted ? 600 : 500,
                                        fontSize: '14px',
                                        fontFamily: item.isFlexTime || item.label === 'Arrival Time:' ? 'monospace' : 'inherit',
                                    } }
                                >
                                    { item.value }
                                </Typography>
                            </Box>
                        </Grid>
                    )) }
                </Grid>

                {/* Clock In Status Indicator */}
                <Box
                    sx={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: isClockedIn ? '#f0fff4' : '#edf2f7',
                        borderRadius: '8px',
                        border: `1px solid ${isClockedIn ? '#c6f6d5' : '#cbd5e0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >
                    {/* Status Indicator Dot */}
                    <Box
                        sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(status),
                            animation: status === 'Working' ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                                '100%': { opacity: 1 },
                            },
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#4a5568',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontSize: '13px',
                            fontWeight: 500,
                        }}
                    >
                        {isClockedIn
                            ? `Current work session in progress (since ${currentClockInTime})`
                            : 'No active work session'
                        }
                    </Typography>
                </Box>

                {/* Additional Summary Stats */ }
                <Box
                    sx={ {
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: '#edf2f7',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e0',
                    } }
                >
                    <Typography
                        variant="body2"
                        sx={ {
                            color: '#4a5568',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontSize: '13px',
                        } }
                    >
                        Current work session in progress
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};
