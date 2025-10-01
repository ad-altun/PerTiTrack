import { Box, Typography, Paper, Divider, Alert } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

export default function AccessibilityStatement() {
 return (
     <Paper elevation={0} sx={{ p: 4 }}>
         <Typography
             variant="h3"
             component="h1"
             gutterBottom
             sx={{ fontWeight: 600, mb: 2 }}
         >
             Erklärung zur Barrierefreiheit
         </Typography>

         <Typography variant="body1" paragraph>
             Wir sind bestrebt, unsere Website im Einklang mit den Bestimmungen zur Barrierefreiheit
             zugänglich zu machen. Diese Erklärung zur Barrierefreiheit gilt für die Website
             PerTiTrack.
         </Typography>

         <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
             Stand dieser Erklärung: {new Date().toLocaleDateString('de-DE', {
             year: 'numeric',
             month: 'long',
             day: 'numeric'
         })}
         </Typography>

         <Divider sx={{ mb: 4 }} />

         {/* Standards Compliance */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 1. Konformitätsstatus
             </Typography>
             <Typography variant="body1" paragraph>
                 Diese Website ist teilweise konform mit den
                 <strong> Web Content Accessibility Guidelines (WCAG) 2.1</strong> auf dem Level AA.
             </Typography>
             <Alert severity="info" sx={{ mb: 2 }}>
                 <strong>Hinweis:</strong> Als Portfolio/Showcase-Projekt sind wir nicht rechtlich
                 verpflichtet, WCAG-konform zu sein, streben aber dennoch eine hohe Barrierefreiheit an.
             </Alert>
         </Box>

         {/* Implemented Features */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 2. Umgesetzte Maßnahmen zur Barrierefreiheit
             </Typography>
             <Typography variant="body1" paragraph>
                 Wir haben folgende Maßnahmen ergriffen, um die Zugänglichkeit dieser Website zu
                 gewährleisten:
             </Typography>

             <Box sx={{ pl: 2 }}>
                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Semantisches HTML
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Verwendung korrekter HTML5-Elemente für eine bessere
                             Bildschirmleser-Unterstützung
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Tastaturnavigation
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Alle interaktiven Elemente sind über die Tastatur erreichbar und bedienbar
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Fokus-Indikatoren
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Deutlich sichtbare Fokus-Markierungen für Tastaturnutzer
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Farbkontraste
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Ausreichende Kontrastverhältnisse (mindestens 4.5:1 für normalen Text)
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Alternative Texte
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Beschreibende alt-Attribute für alle informativen Bilder
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             ARIA-Labels
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Verwendung von ARIA-Attributen für dynamische Inhalte und komplexe Widgets
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Responsive Design
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Optimierung für verschiedene Bildschirmgrößen und Vergrößerungsstufen
                         </Typography>
                     </Box>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                             Formular-Beschriftungen
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                             Eindeutige Labels für alle Formularfelder mit Fehlerhinweisen
                         </Typography>
                     </Box>
                 </Box>
             </Box>
         </Box>

         {/* Known Limitations */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 3. Bekannte Einschränkungen
             </Typography>
             <Typography variant="body1" paragraph>
                 Trotz unserer Bemühungen können einige Bereiche der Website noch nicht vollständig
                 barrierefrei sein:
             </Typography>

             <Box sx={{ pl: 2 }}>
                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                     <WarningIcon sx={{ color: 'warning.main', mr: 1, mt: 0.5 }} />
                     <Box>
                         <Typography variant="body2">
                             <strong>Komplexe Datenvisualisierungen:</strong> Einige Diagramme und
                             Grafiken bieten möglicherweise noch keine vollständigen Textalternativen.
                         </Typography>
                     </Box>
                 </Box>
             </Box>

             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                 Wir arbeiten kontinuierlich daran, diese Einschränkungen zu beheben.
             </Typography>
         </Box>

         {/* Feedback */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 4. Feedback und Kontakt
             </Typography>
             <Typography variant="body1" paragraph>
                 Wir freuen uns über Ihr Feedback zur Barrierefreiheit dieser Website. Wenn Sie auf
                 Barrieren stoßen oder Verbesserungsvorschläge haben, kontaktieren Sie uns bitte:
             </Typography>
             <Box sx={{ pl: 2, mb: 2 }}>
                 <Typography variant="body1">
                     <strong>E-Mail:</strong> [ihre-email@beispiel.de]
                     <br />
                     <strong>Telefon:</strong> [+49 xxx xxxxxxxx] (optional)
                 </Typography>
             </Box>
             <Typography variant="body2" color="text.secondary">
                 Wir bemühen uns, auf Anfragen innerhalb von 5 Werktagen zu reagieren.
             </Typography>
         </Box>

         {/* Testing */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 5. Bewertungsmethode
             </Typography>
             <Typography variant="body1" paragraph>
                 Die Barrierefreiheit dieser Website wurde durch folgende Methoden bewertet:
             </Typography>
             <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                 <li>Selbstbewertung durch das Entwicklungsteam</li>
                 <li>Automatisierte Tests mit Tools wie:
                     <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                         <li>axe DevTools</li>
                         <li>Lighthouse Accessibility Audit</li>
                         <li>WAVE (Web Accessibility Evaluation Tool)</li>
                     </Box>
                 </li>
                 <li>Manuelle Tests mit Bildschirmlesern (NVDA, JAWS, VoiceOver)</li>
                 <li>Tastatur-Navigation-Tests</li>
                 <li>Farbkontrast-Überprüfungen</li>
             </Box>
         </Box>

         {/* Technical Specifications */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 6. Technische Spezifikationen
             </Typography>
             <Typography variant="body1" paragraph>
                 Die Barrierefreiheit dieser Website basiert auf folgenden Technologien:
             </Typography>
             <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                 <li>HTML5</li>
                 <li>CSS3</li>
                 <li>JavaScript (React)</li>
                 <li>ARIA (Accessible Rich Internet Applications)</li>
                 <li>Material-UI Komponenten mit Accessibility-Support</li>
             </Box>
             <Typography variant="body2" color="text.secondary">
                 Diese Technologien werden in Kombination mit folgenden Webbrowsern und assistiven
                 Technologien unterstützt:
             </Typography>
             <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                 <li>Aktuelle Versionen von Chrome, Firefox, Safari, Edge</li>
                 <li>Bildschirmleseprogramme: NVDA, JAWS, VoiceOver</li>
                 <li>Spracherkennungssoftware: Dragon NaturallySpeaking</li>
             </Box>
         </Box>

         {/* Compatibility */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 7. Kompatibilität mit Browsern und assistiven Technologien
             </Typography>
             <Typography variant="body1" paragraph>
                 Diese Website wurde entwickelt, um mit folgenden assistiven Technologien kompatibel
                 zu sein:
             </Typography>
             <Box component="ul" sx={{ pl: 4 }}>
                 <li>Bildschirmleseprogrammen in Kombination mit aktuellen Desktop-Browsern</li>
                 <li>Browser-eigenen Zoom-Funktionen (bis zu 200% Vergrößerung)</li>
                 <li>Sprachsteuerungssoftware</li>
                 <li>Alternative Eingabegeräte (z.B. Kopfzeiger, Ein-Tasten-Maus)</li>
             </Box>
         </Box>

         {/* Enforcement */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 8. Durchsetzungsverfahren
             </Typography>
             <Typography variant="body1" paragraph>
                 Falls Sie auf Barrierefreiheitsprobleme stoßen und mit unserer Antwort nicht
                 zufrieden sind, können Sie sich an folgende Schlichtungsstelle wenden:
             </Typography>
             <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                 <Typography variant="body2">
                     <strong>Schlichtungsstelle nach dem BGG</strong>
                     <br />
                     Mauerstraße 53
                     <br />
                     10117 Berlin
                     <br />
                     <br />
                     Telefon: +49 (0)30 18 527-2805
                     <br />
                     E-Mail: info@schlichtungsstelle-bgg.de
                     <br />
                     <a
                         href="https://www.schlichtungsstelle-bgg.de"
                         target="_blank"
                         rel="noopener noreferrer"
                         style={{ color: '#1976d2' }}
                     >
                         www.schlichtungsstelle-bgg.de
                     </a>
                 </Typography>
             </Box>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                 <em>
                     Hinweis: Die Schlichtungsstelle ist primär für öffentliche Stellen zuständig.
                     Als private Website sind wir nicht zur Teilnahme am Schlichtungsverfahren
                     verpflichtet, stehen aber für einen konstruktiven Dialog zur Verfügung.
                 </em>
             </Typography>
         </Box>

         <Divider sx={{ my: 4 }} />

         {/* Tips for Users */}
         <Box sx={{ mb: 4 }}>
             <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                 Tipps für eine bessere Nutzererfahrung
             </Typography>

             <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                 Tastaturkürzel
             </Typography>
             <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                 <li><kbd>Tab</kbd>: Zwischen interaktiven Elementen navigieren</li>
                 <li><kbd>Shift + Tab</kbd>: Rückwärts navigieren</li>
                 <li><kbd>Enter</kbd> oder <kbd>Leertaste</kbd>: Element aktivieren</li>
                 <li><kbd>Esc</kbd>: Dialoge schließen</li>
             </Box>

             <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                 Browser-Funktionen nutzen
             </Typography>
             <Box component="ul" sx={{ pl: 4 }}>
                 <li><strong>Zoom:</strong> Strg/Cmd + Plus/Minus</li>
                 <li><strong>Hoher Kontrast:</strong> In den Browser-Einstellungen aktivierbar</li>
                 <li><strong>Textgröße:</strong> In den Browser-Einstellungen anpassbar</li>
             </Box>
         </Box>

         <Divider sx={{ my: 4 }} />

         <Typography variant="body2" color="text.secondary" align="center">
             Diese Erklärung zur Barrierefreiheit wurde zuletzt am{' '}
             {new Date().toLocaleDateString('de-DE', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric'
             })} aktualisiert.
             <br />
             <br />
             Wir überprüfen und aktualisieren diese Erklärung regelmäßig im Zuge der
             kontinuierlichen Verbesserung unserer Website.
         </Typography>
     </Paper>
 );
};
