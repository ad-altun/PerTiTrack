import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { AccessTime, Assessment, EventNote } from '@mui/icons-material';
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
    const theme = useTheme();

    const features = [
        {
            icon: AccessTime,
            title: 'Time Tracking',
            description: 'Effortlessly track working hours with intuitive clock-in/clock-out system. Monitor breaks, overtime, and daily activities in real-time with precision.',
        },
        {
            icon: Assessment,
            title: 'Reports & Analytics',
            description: 'Generate comprehensive timesheet reports and gain insights into work patterns. Export data for payroll and project management with ease.',
        },
        {
            icon: EventNote,
            title: 'Absence Management',
            description: 'Request and manage vacations, sick leaves, and other absences. View your team\'s availability calendar at a glance for better planning.',
        },
    ];

    return (
        <Box
            sx={ {
                py: { xs: 8, md: 12 },
                backgroundColor: 'background.default',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: theme.palette.mode === 'light'
                        ? 'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
                },
            } }
        >
            <Container maxWidth="lg">
                {/* Section Header */ }
                <Box
                    sx={ {
                        textAlign: 'center',
                        mb: 8,
                    } }
                >
                    <Typography
                        variant="overline"
                        sx={ {
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            color: 'primary.main',
                            mb: 2,
                            display: 'block',
                        } }
                    >
                        POWERFUL FEATURES
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={ {
                            fontSize: { xs: '2rem', md: '2.75rem' },
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary',
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -12,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 60,
                                height: 4,
                                borderRadius: 2,
                                background: theme.palette.mode === 'light'
                                    ? 'linear-gradient(90deg, #2563eb, #3b82f6)'
                                    : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                            },
                        } }
                    >
                        Everything You Need
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={ {
                            mt: 4,
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            color: 'text.secondary',
                            maxWidth: 700,
                            mx: 'auto',
                            lineHeight: 1.7,
                        } }
                    >
                        Built for modern businesses, PerTiTrack provides all the tools you need
                        to manage workforce time efficiently and accurately.
                    </Typography>
                </Box>

                {/* Feature Cards Grid */ }
                <Grid
                    container
                    rowSpacing={ 8 }
                    columnSpacing={ 20 }
                    sx={ {
                        mt: 2,
                    } }
                    columns={ { xs: 1, sm: 2, md: 3 } }
                    wrap={ 'nowrap' }
                    direction={{ xs: 'column', md: 'row' }}
                >
                    { features.map(( feature, index ) => (
                        <Grid
                            key={ index }
                            sx={ { xs: '12', md: 4 } }
                        >
                            <FeatureCard
                                icon={ feature.icon }
                                title={ feature.title }
                                description={ feature.description }
                                delay={ index * 150 }
                            />
                        </Grid>
                    )) }
                </Grid>

                {/* Decorative Elements */ }
                <Box
                    sx={ {
                        position: 'absolute',
                        top: '30%',
                        left: '-5%',
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: theme.palette.mode === 'light'
                            ? 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    } }
                />
                <Box
                    sx={ {
                        position: 'absolute',
                        bottom: '20%',
                        right: '-5%',
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: theme.palette.mode === 'light'
                            ? 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    } }
                />
            </Container>
        </Box>
    );
}