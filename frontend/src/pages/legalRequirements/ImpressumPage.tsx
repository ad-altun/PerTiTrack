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
                        <strong>E-Mail:</strong> adaltun@web.de
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
// <div>
//     <h1>Impressum</h1>
//
//     <p>Angaben gem&auml;&szlig; &sect; 5 TMG</p>
//     <p>Angaben gemäß § 5 TMG</p>
//
//     <p>Abidin Deniz Altun<br />
//         Liststr. 44<br />
//         89518 Heidenheim an der Brenz</p>
//
//     <h2>Kontakt</h2>
//     <p>E-Mail: mustermann@musterfirma.de</p>
//
//     Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
//     Abidin Deniz Altun, Liststr. 44, 89518 Heidenheim an der Brenz
//
//     <h2>Haftungsausschluss: </h2>
//     <p>
//         Dies ist eine private Portfolio-Webanwendung, die ausschließlich
//         zu Demonstrations- und Bewerbungszwecken betrieben wird.
//         Es handelt sich nicht um ein kommerzielles Angebot.
//     </p>
//
// </div>
