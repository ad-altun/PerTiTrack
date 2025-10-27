import { Box, Container, Typography, Stack, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { label: 'Impressum', path: '/legal/impressum' },
        { label: 'Privacy', path: '/legal/privacy-policy' },
        { label: 'Terms', path: '/legal/terms-of-service' },
        { label: 'Accessibility', path: '/legal/accessibility-statement' },
        { label: 'Contact', path: '/legal/contact' },
    ];

    return (
        <Box
            component="footer"
            sx={ {
                py: { xs: 2.5, sm: 3 },
                px: 2,
                mt: 'auto',
                backgroundColor: ( theme ) =>
                    theme.palette.mode === 'dark'
                        ? 'background.paper'
                        : '#FAFAFA',
                borderTop: 1,
                borderColor: 'divider',
            } }
        >
            <Container maxWidth="lg">
                <Stack
                    spacing={ { xs: 2, sm: 1.5 } }
                    alignItems="center"
                >
                    {/* (Legally) required pages' Links */ }
                    <Stack
                        direction="row"
                        spacing={ { xs: 2, sm: 3 } }
                        flexWrap="wrap"
                        justifyContent="center"
                        sx={ { gap: { xs: 1.5, sm: 2 } } }
                    >
                        { footerLinks.map(( link, index ) => (
                            <MuiLink
                                key={ link.path }
                                component={ Link }
                                to={ link.path }
                                underline="none"
                                sx={ {
                                    fontSize: '0.8125rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                        color: 'primary.main',
                                    },
                                } }
                            >
                                { link.label }
                            </MuiLink>
                        )) }
                    </Stack>

                    {/* Copyright & Credits */ }
                    <Stack
                        direction={ { xs: 'column', sm: 'row' } }
                        spacing={ { xs: 0.5, sm: 1 } }
                        alignItems="center"
                        sx={ { opacity: 0.8 } }
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={ {
                                fontSize: '0.75rem',
                                textAlign: 'center',
                            } }
                        >
                            © { currentYear } PerTiTrack. All rights reserved.
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={ {
                                fontSize: '0.75rem',
                                display: { xs: 'none', sm: 'block' },
                            } }
                        >
                            •
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={ {
                                fontSize: '0.75rem',
                                textAlign: 'center',
                            } }
                        >
                            💻 Developed by Abidin Deniz Altun
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
