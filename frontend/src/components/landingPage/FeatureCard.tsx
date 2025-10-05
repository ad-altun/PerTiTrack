import { Box, Paper, Typography, useTheme } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
    icon: SvgIconComponent;
    title: string;
    description: string;
    delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: '20rem',
                maxWidth: '35rem',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(30,41,59,0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
                '@keyframes fadeInUp': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
                '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? '0 20px 40px rgba(37,99,235,0.15)'
                        : '0 20px 40px rgba(59,130,246,0.25)',
                    borderColor: theme.palette.primary.main,
                    '& .feature-icon': {
                        transform: 'scale(1.1) rotateY(360deg)',
                        background: theme.palette.mode === 'light'
                            ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme.palette.mode === 'light'
                        ? 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
                        : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                    opacity: 1,
                },
            }}
        >
            {/* Icon Container */}
            <Box
                className="feature-icon"
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)'
                        : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                }}
            >
                <Icon
                    sx={{
                        fontSize: 40,
                        color: theme.palette.mode === 'light'
                            ? '#2563eb'
                            : '#60a5fa',
                        transition: 'color 0.3s ease',
                    }}
                />
            </Box>

            {/* Title */}
            <Typography
                variant="h5"
                component="h3"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
            >
                {title}
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                }}
            >
                {description}
            </Typography>
        </Paper>
    );
}