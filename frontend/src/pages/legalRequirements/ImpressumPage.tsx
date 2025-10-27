import { Box, Typography, Paper, Divider } from "@mui/material";

export default function ImpressumPage() {

    return (
        <>
            <Paper elevation={ 0 } sx={ { p: 4 } }>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={ { fontWeight: 600, mb: 3 } }
                >
                    Impressum
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
                    Angaben gemäß § 5 TMG
                </Typography>

                <Divider sx={ { mb: 3 } }/>

                {/* Contact Information */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600 } }>
                        Angaben zum Diensteanbieter
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Abidin Deniz Altun</strong>
                        <br/>

                        <br/>
                        89518 Heidenheim an der Brenz
                        <br/>
                        Deutschland
                    </Typography>
                </Box>

                {/* Contact Details */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600 } }>
                        Kontakt
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>E-Mail:</strong> contact@denizaltun.de
                        <br/>
                    </Typography>
                </Box>

                {/* Responsible for Content */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600 } }>
                        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Abidin Deniz Altun
                        <br/>

                        <br/>
                        89518 Heidenheim an der Brenz
                    </Typography>
                </Box>

                <Divider sx={ { my: 4 } }/>

                {/* Disclaimer */ }
                <Box>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600, mb: 2 } }>
                        Haftungsausschluss
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 3 } }>
                        Haftung für Inhalte
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Dies ist eine private Portfolio-Webanwendung, die ausschließlich
                        zu Demonstrations- und Bewerbungszwecken betrieben wird.
                        Es handelt sich nicht um ein kommerzielles Angebot.
                    </Typography>
                </Box>

                <Divider sx={ { my: 4 } }/>

                <Typography variant="body2" color="text.secondary" align="center">
                    Stand: { new Date().toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) }
                </Typography>
            </Paper>
        </>
    );
};

