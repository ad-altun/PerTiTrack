import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { bookingPanelSchema, type BookingPanelProps } from '../validation/bookingPanelSchema';
import ActionButton from "./ActionButton.tsx";
import WorkflowButton from "./WorkflowButton.tsx";


const BookingPanel: React.FC<BookingPanelProps> = ({
    localDate = "01/22/2025",
    localTime = "09:15:42",
    timeZone = "GMT +01:00 (Berlin)",
    bookingType = "B1 Arrival",
    employeeName = "Jane, Patrick (003)"
}) => {
    // Validate props using Zod
    const validatedProps = bookingPanelSchema.parse({
        localDate,
        localTime,
        timeZone,
        bookingType,
        employeeName
    });

    return (
        <Paper
            elevation={2}
            sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                marginBottom: '20px',
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
                    backgroundColor: '#e2e8f0',
                    padding: '15px 20px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    borderBottom: '1px solid #cbd5e0',
                }}
            >
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Booking
                </Typography>
            </Box>

            {/* Current Info Section */}
            <Box
                sx={{
                    backgroundColor: '#f7fafc',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                }}
            >
                {/* Info Rows */}
                {[
                    { label: 'Local Date:', value: validatedProps.localDate },
                    { label: 'Local Time:', value: validatedProps.localTime },
                    { label: 'Time Zone:', value: validatedProps.timeZone },
                    { label: 'Booking Type:', value: validatedProps.bookingType },
                    { label: 'Employee:', value: validatedProps.employeeName },
                ].map((info, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: index < 4 ? '8px' : 0,
                            padding: '5px 0',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: '#4a5568',
                            }}
                        >
                            {info.label}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#2d3748',
                            }}
                        >
                            {info.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Booking Content */}
            <Box sx={{ padding: '20px' }}>
                <Box
                    sx={{
                        backgroundColor: '#f7fafc',
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                    }}
                >
                <ActionButton activeAction="clockIn" onActionClick={() => console.log('clockIn clicked')} />
                </Box>
                <Box
                    sx={{
                        backgroundColor: '#f7fafc',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '2rem',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <WorkflowButton icon="📅" label="Workflow" onClick={() => console.log('workflow clickde')} />
                    <WorkflowButton icon="🔎" label="Balance" onClick={() => console.log('balance clickde')} />
                </Box>


                <Divider sx={{ marginBottom: '15px' }} />


            </Box>
        </Paper>
    );
};

export default BookingPanel;