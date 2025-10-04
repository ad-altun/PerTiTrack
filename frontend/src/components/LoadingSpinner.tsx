import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
        }}
    >
        <CircularProgress
            size={60}
            thickness={4}
            sx={{
                color: 'primary.main',
            }}
        />
        <Typography
            variant="body1"
            color="text.secondary"
            sx={{
                fontWeight: 500,
                letterSpacing: '0.5px',
            }}
        >
            Loading...
        </Typography>
    </Box>
);

export default LoadingSpinner;