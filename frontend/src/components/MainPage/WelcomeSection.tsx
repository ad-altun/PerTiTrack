import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useAppSelector } from "../../store/hook.ts";
import { selectUserGreeting } from "../../store/slices/authSlice.ts";


const WelcomeSection: React.FC = () => {
    const title = useAppSelector(selectUserGreeting);

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
                {title}
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