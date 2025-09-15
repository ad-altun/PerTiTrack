import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { welcomeSectionSchema, type WelcomeSectionProps } from '../validation/welcomeSectionSchema';

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = "Mr. Jane" }) => {
    // Validate props using Zod
    const validatedProps = welcomeSectionSchema.parse({ userName });

    return (
        <Paper
            elevation={2}
            sx={{
                backgroundColor: 'white',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    color: '#2d3748',
                    fontSize: '24px',
                    marginBottom: '10px',
                    fontWeight: 'normal',
                }}
            >
                Welcome to timekeeper.WEB Employee Portal
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: '#4a5568',
                    marginBottom: '5px',
                }}
            >
                Good day {validatedProps.userName}.
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: '#4a5568',
                    marginBottom: '5px',
                }}
            >
                You have successfully logged in!
            </Typography>
        </Paper>
    );
};

export default WelcomeSection;