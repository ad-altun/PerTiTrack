import React, { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, useTheme, Grid, Chip } from '@mui/material';
import { Flag, CheckCircle, Security, Code } from '@mui/icons-material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            sx={{
                pt: 4,
                animation: value === index ? 'fadeIn 0.5s ease-in' : 'none',
                '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {value === index && children}
        </Box>
    );
}

export default function AboutSection() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const features = [
        { title: 'Intuitive Interface', desc: 'Easy to use for employees and managers, reducing training time' },
        { title: 'Comprehensive Reporting', desc: 'Detailed reports for payroll, compliance, and project tracking' },
        { title: 'Flexible Integration', desc: 'Seamlessly integrate with existing HR and payroll systems' },
        { title: 'Mobile Access', desc: 'Track time on-the-go with responsive mobile interface' },
        { title: 'Real-time Notifications', desc: 'Instant alerts for clock-ins, approvals, and more' },
        { title: 'Customizable Workflows', desc: 'Adapt the system to match your company processes' },
    ];

    const securityFeatures = [
        { icon: '🔒', title: 'Data Encryption', desc: 'All data encrypted in transit and at rest using industry-standard protocols' },
        { icon: '⏱️', title: 'Auto Session Timeout', desc: '15-minute timeout prevents unauthorized access on shared workstations' },
        { icon: '🛡️', title: 'Role-Based Access', desc: 'Granular permissions ensure employees only see authorized data' },
        { icon: '📊', title: 'Audit Trails', desc: 'Complete logs track all actions for compliance and security monitoring' },
    ];

    const techStack = {
        frontend: [
            'React with TypeScript for type-safe code',
            'Vite for lightning-fast development',
            'Material-UI for consistent design',
            'Redux Toolkit for state management',
        ],
        backend: [
            'Spring Boot for enterprise Java backend',
            'RESTful API architecture',
            'PostgreSQL for reliable data storage',
            'Flyway for database migrations',
        ],
        quality: [
            'SonarQube Cloud for code quality',
            'Render Cloud for scalable deployment',
            'Automated testing and CI/CD',
            'Regular security audits',
        ],
    };

    return (
        <Box
            id="about-section"
            sx={{
                minHeight: '100dvh',
                margin: '0 auto',
                py: { xs: 8, lg: 12, },
                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            // fontSize: { xs: '2rem', md: '2.75rem' },
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary',
                        }}
                    >
                        About PerTiTrack
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            color: 'text.secondary',
                            maxWidth: 800,
                            mx: 'auto',
                            lineHeight: 1.7,
                        }}
                    >
                        A comprehensive enterprise time management solution designed for businesses that need
                        reliable, secure, and efficient employee time tracking.
                    </Typography>
                </Box>

                {/* Tabs Container */}
                <Container maxWidth="lg" >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: theme.palette.mode === 'light'
                                ? '0 4px 12px rgba(0,0,0,0.08)'
                                : '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Tabs */}
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                backgroundColor: theme.palette.mode === 'light' ? '#e2e8f0' : '#0f172a',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                '& .MuiTab-root': {
                                    minHeight: 64,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                },
                            }}
                        >
                            <Tab icon={<Flag />} iconPosition="start" label="Our Mission" />
                            <Tab icon={<CheckCircle />} iconPosition="start" label="Why Choose Us" />
                            <Tab icon={<Security />} iconPosition="start" label="Security" />
                            <Tab icon={<Code />} iconPosition="start" label="Technology" />
                        </Tabs>

                        {/* Tab Panels */}
                        <Box sx={{
                            p: { xs: 3, md: 4 }, textAlign: 'center'

                        }}>
                            {/* Mission Tab */}
                            <TabPanel value={activeTab} index={0}>
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                                    Our Mission
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}>
                                    Our mission is to empower organizations with cutting-edge time management tools
                                    that simplify workforce administration and enhance productivity. We believe accurate
                                    time tracking is the foundation of fair compensation and efficient project management.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
                                    PerTiTrack helps businesses of all sizes streamline workforce management, ensure
                                    accurate payroll calculations, and maintain compliance with labor regulations.
                                </Typography>

                                <Grid container spacing={3} sx={{ mt: 2, display: 'flex', justifyContent: 'center', }}>
                                    {[
                                        { icon: '🎯', title: 'Accuracy', desc: 'Precise time tracking down to the second' },
                                        { icon: '🤝', title: 'Reliability', desc: '99.9% uptime guarantee for your business' },
                                        { icon: '💡', title: 'Innovation', desc: 'Continuous improvement and feature updates' },
                                    ].map((item, idx) => (
                                        <Grid key={idx}
                                              sx={{ xs:'12', md:'4' }}>
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    p: 3,
                                                    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                                                    borderRadius: 2,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                <Typography variant="h3" sx={{ mb: 1 }}>{item.icon}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* Features Tab */}
                            <TabPanel value={activeTab} index={1}>
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, color: 'text.primary', textAlign: 'center' }}>
                                    Why Choose PerTiTrack
                                </Typography>
                                <Grid container spacing={2}
                                      sx={{
                                          display: 'flex',
                                          flexDirection: { xs: 'column', md: 'row' },
                                          justifyContent: 'center',
                                          paddingBlock: '.5rem',
                                          alignItems: 'center',
                                      }}
                                >
                                    {features.map((feature, idx) => (
                                        <Grid key={idx}
                                              sx={{ xs:'12', md:'6', minWidth: '15rem',
                                                  maxWidth: '30rem', width: '100%',
                                              }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2.5,
                                                    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                                                    borderRadius: 2,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        transform: 'translateX(4px)',
                                                    },
                                                }}
                                            >
                                                <CheckCircle sx={{ color: 'success.main', }} />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent:'center',

                                                    }}
                                                >
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {feature.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                        {feature.desc}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* Security Tab */}
                            <TabPanel value={activeTab} index={2}>
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary', }}>
                                    Enterprise-Grade Security
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8, }}>
                                    Security is our top priority. We protect employee time data with the highest standards,
                                    ensuring compliance and preventing unauthorized access.
                                </Typography>

                                <Grid container spacing={3}
                                      sx={{
                                          display: 'flex',
                                          flexDirection: { xs: 'column', md: 'row' },
                                          justifyContent: 'center',
                                          paddingBlock: '.5rem',
                                          alignItems: 'center',
                                      }}
                                >
                                    {securityFeatures.map((item, idx) => (
                                        <Grid key={idx}
                                              sx={{ xs:'12', md:'6', }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                                                    borderRadius: 2,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    maxWidth: '25rem',
                                                }}
                                            >
                                                <Typography variant="h3" sx={{ mb: 2 }}>{item.icon}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                    {item.desc}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>

                            {/* Technology Tab */}
                            <TabPanel value={activeTab} index={3}
                            >
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary', }}>
                                    Built with Modern Technology
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8, }}>
                                    PerTiTrack uses cutting-edge technologies to ensure performance, reliability,
                                    and scalability for businesses of all sizes.
                                </Typography>

                                <Grid container spacing={3}
                                      sx={{
                                          display: 'flex',
                                          flexDirection: { xs: 'column', md: 'row' },
                                          justifyContent: 'center',
                                          paddingBlock: '.5rem',
                                          alignItems: 'center',
                                      }}
                                >
                                    {[
                                        { title: 'Frontend', items: techStack.frontend, color: '#3b82f6' },
                                        { title: 'Backend', items: techStack.backend, color: '#10b981' },
                                        { title: 'Quality & Deployment', items: techStack.quality, color: '#f59e0b' },
                                    ].map((category, idx) => (
                                        <Grid key={idx}
                                              sx={{ xs:'12' }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                                                    borderRadius: 2, maxWidth: '30rem',
                                                    borderLeft: `4px solid ${category.color}`,
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: category.color }}>
                                                    {category.title}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex', flexWrap: 'wrap', gap: 1,
                                                    flexDirection: 'column', maxWidth: '20rem',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    {category.items.map((item, itemIdx) => (
                                                        <Chip
                                                            key={itemIdx}
                                                            label={item}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b',
                                                                fontWeight: 500, textAlign: 'left'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Box>

                </Container>
            </Container>
        </Box>
    );
}