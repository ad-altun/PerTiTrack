import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { ArrowForward, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState('');
    const fullText = 'Professional Personnel Time Tracking';

    // Typing animation effect
    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 80);

        return () => clearInterval(typingInterval);
    }, []);

    const handleGetStarted = () => {
        navigate('/auth/signin');
    };

    const handleLearnMore = () => {
        document.getElementById('about-section')?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    return (
        <Box
            id="hero-section"
            sx={{
                position: 'relative',
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
                color: 'white',
                pt: { xs: 8, md: 12 },
                pb: { xs: 10, md: 14 },
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                },
            }}
        >
            {/* Floating decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    filter: 'blur(80px)',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-30px)' },
                    },
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        maxWidth: 900,
                        mx: 'auto',
                        textAlign: 'center',
                    }}
                >
                    {/* Icon with animation */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            mb: 4,
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': {
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 0 0 rgba(255,255,255,0.4)',
                                },
                                '50%': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 0 20px rgba(255,255,255,0)',
                                },
                            },
                        }}
                    >
                        <Schedule sx={{ fontSize: 40, color: 'white' }} />
                    </Box>

                    {/* Main heading with typing effect */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                            lineHeight: 1.2,
                        }}
                    >
                        Welcome to PerTiTrack
                    </Typography>

                    {/* Subtitle with typing animation */}
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.25rem', md: '1.75rem' },
                            fontWeight: 400,
                            mb: 5,
                            opacity: 0.95,
                            minHeight: { xs: '60px', md: '50px' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&::after': {
                                content: displayText.length === fullText.length ? '""' : '"|"',
                                ml: 0.5,
                                animation: displayText.length === fullText.length ? 'none' : 'blink 1s step-end infinite',
                                '@keyframes blink': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0 },
                                },
                            },
                        }}
                    >
                        {displayText}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            mb: 6,
                            opacity: 0.9,
                            maxWidth: 700,
                            mx: 'auto',
                            lineHeight: 1.7,
                        }}
                    >
                        Streamline your workforce management with our enterprise-grade time tracking solution.
                        Built for companies that value accuracy, security, and efficiency.
                    </Typography>

                    {/* CTA Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={handleGetStarted}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                backgroundColor: theme.palette.mode === 'light'
                                    ? '#2563eb'
                                    : '#3b82f6',
                                color: 'white',
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'light'
                                        ? '#1d4ed8'
                                        : '#2563eb',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 32px rgba(37, 99, 235, 0.5)',
                                },
                            }}
                        >
                            Get Started
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleLearnMore}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                borderRadius: 2,
                                textTransform: 'none',
                                backdropFilter: 'blur(10px)',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}