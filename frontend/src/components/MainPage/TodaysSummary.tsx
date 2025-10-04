import { Box, Chip, Grid, LinearProgress, Paper, Tooltip, Typography } from "@mui/material";
import { useGetTodaySummaryQuery } from "../../store/api/timetrackApi.ts";
import { AccessTime, Refresh, TrendingUp, WorkOutline } from "@mui/icons-material";
import Schedule from "@mui/icons-material/Schedule";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";

export default function TodaysSummary() {
    // get data from RTK Query API
    const {
        data: todaySummary,
        isLoading,
        error,
        refetch: refetchTodaySummary,
        isFetching,
    } = useGetTodaySummaryQuery(undefined, {
        // These options ensure the data is always fresh
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        // Optional: poll every 180 seconds for live updates
        pollingInterval: 180000,
    });

    const breakTime = todaySummary?.breakTime || "00:00:00";
    const workingTime = todaySummary?.workingTime || "00:00:00";
    const flexTime = todaySummary?.flexTime || "-08:00:00";

    const [ isRefreshing, setIsRefreshing ] = useState<boolean>(false);
    // use backend status directly, (no frontend interpretation)
    const currentStatus = todaySummary?.status || 'Not Started';

    // handle manual refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Force refetch from backend
            await refetchTodaySummary();

            // Optional: Add a small delay to show the refresh animation
            setTimeout(() => {
                setIsRefreshing(false);
            }, 500);
        } catch (error) {
            console.error('Failed to refresh time data:', error);
            setIsRefreshing(false);
        }
    };

    // Calculate working time percentage based on 8-hour day
    const calculateCompletionPercentage = (): number => {
        if ( !workingTime || workingTime === "00:00:00" ) {
            return 0;
        }
        // const workingTimeString = workingTime || "+00:00";
        const [hours, minutes] = workingTime
            .replace(/^[+-]/, '')
            .split(':')
            .map(Number);
        const totalMinutes = hours * 60 + minutes ;
        const standardMinutes = 8 * 60; // 8 hours

        return Math.min(( totalMinutes / standardMinutes ) * 100, 100);
    };

    // Get status color and info
    const getStatusInfo = ( status: string ) => {
        switch ( status ) {
            case 'Working':
                return {
                    color: 'success',
                    bgColor: '#c6f6d5',
                    textColor: '#22543d',
                    icon: <WorkOutline fontSize="small"/>,
                    pulse: true
                };
            case 'Break':
                return {
                    color: 'warning',
                    bgColor: '#fef5e7',
                    textColor: '#7d4f01',
                    icon: <AccessTime fontSize="small"/>,
                    pulse: true
                };
            case 'Finished':
                return {
                    color: 'info',
                    bgColor: '#e6fffa',
                    textColor: '#234e52',
                    icon: <Schedule fontSize="small"/>,
                    pulse: false
                };
            default:
                return {
                    color: 'default',
                    bgColor: '#f7fafc',
                    textColor: '#4a5568',
                    icon: <Schedule fontSize="small"/>,
                    pulse: false
                };
        }
    };

    const statusInfo = getStatusInfo(currentStatus);
    const completionPercentage = calculateCompletionPercentage();

    // Parse flex time for display
    const getFlexTimeInfo = () => {
        // Safely get flexTime with fallback
        // const flexTimeValue = flexTime || "+00:00";

        const isPositive = !flexTime.startsWith('-');

        // Safe parsing with proper error handling
        const cleanTime = flexTime.replace(/^[+-]/, '');
        const [hours = 0, minutes = 0] = cleanTime.split(':').map(Number);

        const totalMinutes = hours * 60 + minutes;

        return {
            isPositive,
            totalMinutes,
            displayText: `${isPositive ? '+' : '-'}${hours}h ${minutes}m`
        };
    };

    const flexTimeInfo = getFlexTimeInfo();

    const summaryItems = [
        {
            label: 'Arrival Time: ',
            value: todaySummary?.arrivalTime || 'Not Started',
            icon: <Schedule fontSize="small"/>,
            highlight: !!todaySummary?.arrivalTime && currentStatus === 'Working',
            isTimeValue: false
        },
        {
            label: 'Break Time: ',
            value: breakTime,
            icon: <AccessTime fontSize="small"/>,
            highlight: currentStatus === 'Break',
            isTimeValue: true
        },
        {
            label: 'Working Time: ',
            value: workingTime,
            icon: <WorkOutline fontSize="small"/>,
            highlight: currentStatus === 'Working',
            isTimeValue: true
        },
        {
            label: 'Flex Time: ',
            value: todaySummary?.flexTime,
            isFlexTime: true,
            icon: <TrendingUp fontSize="small"/>,
            highlight: Math.abs(flexTimeInfo.totalMinutes) > 30,
            isTimeValue: true
        },
        {
            label: 'Status: ',
            value: currentStatus,
            isStatus: true,
            icon: statusInfo.icon,
            highlight: true,
            isTimeValue: false
        },
    ];

    if ( isLoading ) {
        return (
            <Paper elevation={ 2 } sx={ { p: 3, borderRadius: 2 } }>
                <Box sx={ { display: 'flex', alignItems: 'center', mb: 2 } }>
                    <Typography variant="h6" sx={ { fontWeight: 600, flexGrow: 1 } }>
                        Today's Summary
                    </Typography>
                    <LinearProgress sx={ { width: 100, height: 6, borderRadius: 3 } }/>
                </Box>
                { [ ...Array(5) ].map(( _, i ) => (
                    <Box key={ i } sx={ { height: 60, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 } }/>
                )) }
            </Paper>
        );
    }

    if ( error ) {
        return (
            <Paper elevation={ 2 } sx={ { p: 3, borderRadius: 2 } }>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography color="error">Error loading today's summary</Typography>
                    <Tooltip title="Refresh time values">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            size="small"
                            sx={{
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                            }}
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' }
                                    }
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={ 2 }
            sx={ {
                borderRadius: 2,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            } }
        >
            {/* Header with Refresh Button */ }
            <Box
                sx={{
                    // background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                    backgroundColor: 'background.cardSection',
                    color: 'text.primary',
                    p: '10px 20px',
                    gap: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Schedule />
                <Typography variant="h6"
                            sx={{ fontWeight: 600, display: 'flex', width: '100%',
                                alignItems: 'center', gap: 1, paddingBottom: '0px',
                                borderBottom: '2px solid', borderColor: 'border.main',
                            }}>
                    Today's Summary
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentStatus !== 'Not Started' && (
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {new Date().toLocaleDateString('de-DE')}
                        </Typography>
                    )}

                    <Tooltip title="Refresh Today's Summary">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing || isFetching}
                            size="small"
                            sx={{
                                color: 'white',
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'scale(1.1)'
                                },
                                '&:disabled': {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <Refresh
                                fontSize="small"
                                sx={{
                                    color: (isRefreshing || isFetching) ? 'text.muted' : 'primary.light',
                                    animation: (isRefreshing || isFetching) ? 'spin 1s linear infinite' : 'none',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' }
                                    }
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Refresh Indicator */}
            {(isRefreshing || isFetching) && (
                <Box sx={{ px: 3, pt: 1 }}>
                    <LinearProgress
                        sx={{
                            height: 2,
                            borderRadius: 1,
                            backgroundColor: '#e3f2fd',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1976d2'
                            }
                        }}
                    />
                </Box>
            )}

            {/* Progress Bar for Work Completion */ }
            {currentStatus !== 'Not Started' && (
                <Box sx={{ px: 3, pt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            Daily Progress
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {Math.round(completionPercentage)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: completionPercentage >= 100 ? '#38a169' : '#4299e1',
                            },
                        }}
                    />
                </Box>
            )}

            {/* Summary Content */ }
            <Box sx={{ p: 3, backgroundColor: 'background.cardSection' }}>
                <Grid container spacing={2}>
                    {summaryItems.map((item, index) => (
                        <Grid sx={{ xs: 12, width: '100%' }} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    backgroundColor: 'background.cardItem',
                                    borderRadius: 2,
                                    border: item.highlight ? '2px solid #bfdbfe' : '1px solid #e2e8f0',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        backgroundColor: item.highlight ? '#e0f2fe' : '#e0f2fe',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                    // Add visual indicator for refreshed time values
                                    ...(item.isTimeValue && (isRefreshing || isFetching) && {
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, transparent, #4299e1, transparent)',
                                            animation: 'shimmer 1.5s infinite',
                                            '@keyframes shimmer': {
                                                '0%': { transform: 'translateX(-100%)' },
                                                '100%': { transform: 'translateX(100%)' }
                                            }
                                        }
                                    })
                                }}
                            >
                                {/* Icon */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            color: item.isFlexTime
                                                ? (flexTimeInfo.isPositive ? '#38a169' : '#e53e3e')
                                                : item.isStatus
                                                    ? statusInfo.textColor
                                                    : '#4a5568',
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#4a5568',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>

                                {/* Value */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.isStatus ? (
                                        <Chip
                                            label={item.value}
                                            size="small"
                                            icon={statusInfo.pulse ? statusInfo.icon : undefined}
                                            sx={{
                                                backgroundColor: statusInfo.bgColor,
                                                color: statusInfo.textColor,
                                                fontWeight: 600,
                                                '& .MuiChip-icon': {
                                                    color: statusInfo.textColor,
                                                    animation: statusInfo.pulse ? 'pulse 2s infinite' : 'none',
                                                },
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: item.isFlexTime
                                                    ? (flexTimeInfo.isPositive ? '#38a169' : '#e53e3e')
                                                    : '#2d3748',
                                                fontWeight: item.isFlexTime ? 700 : 600,
                                                fontSize: '0.95rem',
                                                fontFamily: item.isFlexTime || item.label.includes('Time') ? 'monospace' : 'inherit',
                                                letterSpacing: item.isFlexTime ? '0.5px' : 'normal',
                                                // Add subtle glow effect for refreshed values
                                                ...(item.isTimeValue && (isRefreshing || isFetching) && {
                                                    textShadow: '0 0 8px rgba(66, 153, 225, 0.3)'
                                                })
                                            }}
                                        >
                                            {item.value}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Pulse animation for active states */}
                                {item.highlight && statusInfo.pulse && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: statusInfo.textColor,
                                            animation: 'pulse 2s infinite',
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Additional Info */}
                {currentStatus !== 'Not Started' && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            backgroundColor: flexTimeInfo.isPositive ? '#f0fff4' : '#fef5f5',
                            borderRadius: 2,
                            border: `1px solid ${flexTimeInfo.isPositive ? '#c6f6d5' : '#fed7d7'}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: flexTimeInfo.isPositive ? '#22543d' : '#742a2a',
                                textAlign: 'center',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                            }}
                        >
                            {flexTimeInfo.totalMinutes >= 30
                                ? flexTimeInfo.isPositive ?
                                    `You're ahead by ${flexTimeInfo.displayText} today! 🚀`:
                                    `You're behind by ${flexTimeInfo.displayText} today! 💻`
                                : flexTimeInfo.totalMinutes <= -30
                                    ? `${Math.abs(flexTimeInfo.totalMinutes / 60).toFixed(1)}h remaining to reach standard hours`
                                    : currentStatus === 'Working'
                                        ? 'Current work session in progress...'
                                        : currentStatus === 'Break'
                                            ? 'Taking a well-deserved break'
                                            : 'Work day completed!'
                            }
                        </Typography>
                    </Box>
                )}
                {/* Last Update Info */}
                {!isLoading && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                            Last updated: {new Date().toLocaleTimeString('de-DE')}
                            {(isRefreshing || isFetching) && ' • Refreshing...'}
                        </Typography>
                    </Box>
                )}

            </Box>

            {/* Custom CSS for animations */ }
            <style>
                {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(66, 153, 225, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
            }
          }
        `}
            </style>
        </Paper>
    );
};
