import { Box, Container, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={ {
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#F3F4F6',
                borderTop: 1,
                borderColor: 'divider',
            } }
        >
            <Container maxWidth="lg">
                {/* Legal Links */ }
                <Box
                    sx={ {
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2 },
                        mb: 2,
                    } }
                >
                    <Link
                        to="/legal/impressum"
                        style={ {
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                        } }
                    >
                        Impressum
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        •
                    </Typography>
                    <Link
                        to="/legal/privacy-policy"
                        style={ {
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                        } }
                    >
                        Privacy Policy
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        •
                    </Typography>
                    <Link
                        to="/legal/terms-of-service"
                        style={ {
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                        } }
                    >
                        Terms of Service
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        •
                    </Typography>
                    <Link
                        to="/legal/accessibility-statement"
                        style={ {
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                        } }
                    >
                        Accessibility
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        •
                    </Typography>
                    <Link
                        to="/legal/contact"
                        style={ {
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                        } }
                    >
                        Contact
                    </Link>
                </Box>

                {/* Copyright */ }
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © { currentYear } PerTiTrack. Alle Rechte vorbehalten.
                </Typography>
            </Container>
        </Box>

    );
};
