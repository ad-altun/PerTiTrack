import { Box, Typography, Paper, Divider, Alert } from "@mui/material";

export default function TermsOfService() {
 return (
     <Paper elevation={0} sx={{ p: 4 }}>
         <Typography
             variant="h3"
             component="h1"
             gutterBottom
             sx={{ fontWeight: 600, mb: 2 }}
         >
             Allgemeine Nutzungsbedingungen
         </Typography>

         <Alert severity="info" sx={{ mb: 4 }}>
             <strong>Hinweis: <i>PerTiTrack (Personnel Time Tracking) ist eine Portfolio/Showcase-Anwendung.</i></strong>
         </Alert>

         <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
             Stand: {new Date().toLocaleDateString('de-DE')}
         </Typography>

         <Divider sx={{ mb: 4 }} />

         {/* 1. Scope */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 1. Geltungsbereich
             </Typography>
             <Typography variant="body1" paragraph>
                 Diese Nutzungsbedingungen regeln die Nutzung der Webanwendung PerTiTrack
                 (nachfolgend "Dienst" genannt). Der Dienst wird bereitgestellt von:
             </Typography>
             <Typography variant="body1" paragraph>
                 Abidin Deniz Altun
                 <br />
                 89518 Heidenheim an der Brenz
                 <br />
                 {/*(siehe Impressum für vollständige Kontaktdaten)*/}
             </Typography>
             <Typography variant="body1" paragraph>
                 Mit der Registrierung und Nutzung des Dienstes akzeptieren Sie diese
                 Nutzungsbedingungen.
             </Typography>
         </Box>

         {/* 2. Service Description - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 2. Leistungsbeschreibung
             </Typography>
             <Typography variant="body1" paragraph>
                 PerTiTrack ist eine webbasierte Anwendung zur Verwaltung von Arbeitszeiten
                 und Abwesenheiten. Der Dienst ermöglicht es Nutzern:
             </Typography>
             <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                 <li>Arbeitszeiten zu erfassen und zu verwalten</li>
                 <li>Überstunden und Urlaubszeiten zu organisieren</li>
                 <li>Abwesenheiten zu dokumentieren</li>
                 <li>Berichte und Auswertungen zu erstellen</li>
             </Box>
             <Typography variant="body1" paragraph>
                 Der Dienst wird derzeit als <strong>Portfolio/Showcase-Projekt</strong> betrieben
                 und ist kostenfrei. Es besteht kein Anspruch auf Verfügbarkeit oder bestimmte
                 Funktionalitäten.
             </Typography>
         </Box>

         {/* 3. Registration - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 3. Registrierung und Nutzerkonto
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>3.1</strong> Für die Nutzung des Dienstes ist eine Registrierung erforderlich.
                 Da es sich um eine Portfolio/Showcase-Anwendung handelt, wird empfohlen,
                 <strong> keine echten personenbezogenen Daten</strong> bei der Registrierung zu verwenden.
                 Sie können Testdaten oder fiktive Angaben verwenden. In der finalen Version ist geplant,
                 dass die Registrierung durch IT-Administratoren oder die Personalabteilung erfolgt,
                 wobei Mitarbeiter eine E-Mail-Adresse und ein temporäres Erstpasswort erhalten
                 (diese Funktionalität befindet sich derzeit in Entwicklung).
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>3.2</strong> Sie sind verpflichtet, Ihre Zugangsdaten geheim zu halten und
                 vor dem Zugriff Dritter zu schützen.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>3.3</strong> Sie sind für alle Aktivitäten verantwortlich, die über Ihr
                 Nutzerkonto erfolgen.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>3.4</strong> Aus Sicherheitsgründen werden Sie automatisch nach 15 Minuten
                 Inaktivität abgemeldet. <em>(Hinweis: Diese Funktion befindet sich derzeit in
                 Entwicklung und wird in einer zukünftigen Version vollständig implementiert.)</em>
             </Typography>
         </Box>

         {/* 4. User Obligations */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 4. Pflichten des Nutzers
             </Typography>
             <Typography variant="body1" paragraph>
                 Bei der Nutzung des Dienstes sind Sie verpflichtet:
             </Typography>
             <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                 <li>Alle geltenden Gesetze und Vorschriften einzuhalten</li>
                 <li>Keine schädlichen Inhalte hochzuladen oder zu verbreiten</li>
                 <li>Keine technischen Schutzmaßnahmen zu umgehen</li>
                 <li>Den Dienst nicht zu missbrauchen oder zu überlasten</li>
                 <li>Keine Rechte Dritter zu verletzen</li>
             </Box>
             <Typography variant="body1" paragraph>
                 Verstöße gegen diese Pflichten können zur sofortigen Sperrung Ihres Zugangs führen.
             </Typography>
         </Box>

         {/* 5. Data and Privacy - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 5. Daten und Datenschutz
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>5.1</strong> Sie bleiben Eigentümer aller Daten, die Sie in den Dienst eingeben.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>5.2</strong> Wir verarbeiten Ihre Daten gemäß unserer Datenschutzerklärung.
                 Da es sich um eine Portfolio/Showcase-Anwendung handelt, empfehlen wir ausdrücklich,
                 keine echten personenbezogenen Daten zu verwenden.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>5.3</strong> In der vollständigen Version werden Funktionen zum Exportieren
                 und Löschen Ihrer Daten zur Verfügung stehen. <em>(Diese Funktionen befinden sich
                 derzeit in Entwicklung.)</em>
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>5.4</strong> Wir empfehlen Ihnen, keine kritischen oder sensiblen Daten in
                 dieser Showcase-Anwendung zu speichern.
             </Typography>
         </Box>

         {/* 6. Availability - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 6. Verfügbarkeit und Wartung
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>6.1</strong> Wir bemühen uns um eine hohe Verfügbarkeit des Dienstes, können
                 diese jedoch nicht garantieren.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>6.2</strong> Der Dienst kann jederzeit zu Wartungszwecken unterbrochen werden.
                 Wir werden versuchen, solche Unterbrechungen auf ein Minimum zu beschränken.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>6.3</strong> Als Portfolio-Projekt behalten wir uns das Recht vor, den Dienst
                 jederzeit ohne Vorankündigung einzustellen.
             </Typography>
         </Box>

         {/* 7. Liability - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 7. Haftung
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>7.1</strong> Der Dienst wird "wie besehen" (as-is) als Portfolio/Showcase-Projekt
                 bereitgestellt. Wir übernehmen keine Gewährleistung für die Richtigkeit, Vollständigkeit,
                 Verfügbarkeit oder Eignung für einen bestimmten Zweck.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>7.2</strong> Die Nutzung des Dienstes erfolgt auf eigenes Risiko. Wir haften
                 nicht für Datenverluste, Systemausfälle oder andere Schäden, die aus der Nutzung oder
                 Nicht-Nutzung des Dienstes entstehen, es sei denn, diese beruhen auf Vorsatz oder
                 grober Fahrlässigkeit unsererseits.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>7.3</strong> Sie sind selbst dafür verantwortlich, keine kritischen oder
                 sensiblen Daten in dieser Showcase-Anwendung zu speichern.
             </Typography>
         </Box>

         {/* 8. Intellectual Property - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 8. Urheberrechte und Nutzungsrechte
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>8.1</strong> Alle Rechte an der Software, dem Design und den Inhalten des
                 Dienstes liegen beim Betreiber oder dessen Lizenzgebern.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>8.2</strong> Sie erhalten ein nicht-ausschließliches, nicht übertragbares
                 Recht zur Nutzung des Dienstes ausschließlich zu <strong>nicht-kommerziellen,
                 persönlichen Demonstrations- und Testzwecken</strong>. Eine gewerbliche oder
                 kommerzielle Nutzung ist ausdrücklich untersagt.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>8.3</strong> Das Reverse Engineering, Dekompilieren oder Disassemblieren der
                 Software ist nicht gestattet.
             </Typography>
         </Box>

         {/* 9. Termination - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 9. Kündigung und Löschung
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>9.1</strong> Sie können Ihr Nutzerkonto jederzeit ohne Angabe von Gründen
                 löschen. <em>(Hinweis: Die Löschungsfunktion über die Kontoeinstellungen befindet
                 sich derzeit in Entwicklung. Für eine Kontolöschung kontaktieren Sie uns bitte über
                 die im Impressum angegebene E-Mail-Adresse.)</em>
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>9.2</strong> Wir können Ihren Zugang bei Verstoß gegen diese
                 Nutzungsbedingungen sperren oder löschen.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>9.3</strong> Nach Löschung des Kontos werden Ihre Daten innerhalb von 30 Tagen
                 vollständig entfernt, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
             </Typography>
         </Box>

         {/* 10. Changes to Terms - UPDATED */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 10. Änderungen der Nutzungsbedingungen
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>10.1</strong> Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu
                 ändern.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>10.2</strong> Änderungen werden auf dieser Seite veröffentlicht. Da es sich um
                 eine Portfolio/Showcase-Anwendung handelt, erfolgt keine individuelle Benachrichtigung
                 per E-Mail. Es liegt in Ihrer Verantwortung, diese Seite regelmäßig auf Änderungen zu
                 überprüfen.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>10.3</strong> Die fortgesetzte Nutzung des Dienstes nach Veröffentlichung von
                 Änderungen gilt als Zustimmung zu den neuen Bedingungen.
             </Typography>
         </Box>

         {/* 11. Applicable Law */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 11. Anwendbares Recht und Gerichtsstand
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>11.1</strong> Es gilt das Recht der Bundesrepublik Deutschland unter
                 Ausschluss des UN-Kaufrechts.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>11.2</strong> Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich
                 zulässig, der Sitz des Betreibers.
             </Typography>
             <Typography variant="body1" paragraph>
                 <strong>11.3</strong> Sollten einzelne Bestimmungen dieser Nutzungsbedingungen
                 unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon
                 unberührt.
             </Typography>
         </Box>

         {/* 12. Contact */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 12. Kontakt
             </Typography>
             <Typography variant="body1" paragraph>
                 Bei Fragen zu diesen Nutzungsbedingungen können Sie uns über die im Impressum
                 angegebenen Kontaktdaten erreichen.
             </Typography>
         </Box>

         <Divider sx={{ my: 4 }} />

         {/* Severability Clause */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 Salvatorische Klausel
             </Typography>
             <Typography variant="body1" paragraph>
                 Sollten einzelne Bestimmungen dieser Nutzungsbedingungen ganz oder teilweise
                 unwirksam sein oder werden, so wird dadurch die Gültigkeit der übrigen Bestimmungen
                 nicht berührt. An die Stelle der unwirksamen oder fehlenden Bestimmungen tritt eine
                 Regelung, die dem wirtschaftlichen Zweck der unwirksamen bzw. fehlenden Bestimmung
                 am nächsten kommt.
             </Typography>
         </Box>

         <Divider sx={{ my: 4 }} />

         <Typography variant="body2" color="text.secondary" align="center">
             <strong>Stand der Nutzungsbedingungen:</strong>{' '}
             {new Date().toLocaleDateString('de-DE', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric'
             })}
             <br />
             <br />
             <em>
                 Bei Fragen erreichen Sie uns unter der im Impressum angegebenen E-Mail-Adresse.
             </em>
         </Typography>
     </Paper>
 );
};
