import { Box, Typography, Paper, Divider } from "@mui/material";

export default function PrivacyPolicyPage() {

    return (
        <>
            <Paper elevation={ 0 } sx={ { p: 4 } }>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={ { fontWeight: 600, mb: 2 } }
                >
                    Datenschutzerklärung
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
                    Stand: { new Date().toLocaleDateString('de-DE') }
                </Typography>

                <Divider sx={ { mb: 4 } }/>

                {/* 1. Overview and Controller */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        1. Verantwortlicher und Datenschutzbeauftragter
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer
                        datenschutzrechtlicher Bestimmungen ist:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Abidin Deniz Altun</strong>
                        <br/>

                        <br/>
                        89518 Heidenheim an der Brenz
                        <br/>
                        Deutschland
                        <br/>
                        <br/>
                        E-Mail: contact@denizaltun.de
                        <br/>
                    </Typography>
                </Box>

                {/* 2. General Information */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        2. Allgemeine Hinweise
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                        personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                        Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.

                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                        personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                        Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        Ausführliche Informationen zum Thema Datenschutz entnehmen
                        Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.

                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Datenerfassung auf dieser Website
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
                        <br/>
                        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                        Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“
                        in dieser Datenschutzerklärung entnehmen.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Wie erfassen wir Ihre Daten?</strong>
                        <br/>
                        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann
                        es sich z.B. um Daten handeln, die Sie in ein Kontaktformular oder bei der Registrierung
                        eingeben.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website
                        durch unsere ITSysteme erfasst. Das sind vor allem technische Daten
                        (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                        Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Wofür nutzen wir Ihre Daten?</strong>
                        <br/>
                        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
                        gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
                        <br/>
                        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
                        Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
                        die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
                        Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
                        widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung
                        der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen
                        ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Hierzu sowie zu weiteren
                        Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen
                        Adresse an uns wenden
                    </Typography>
                </Box>

                {/* 3. Hosting */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        3. Hosting und Content Delivery
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Externes Hosting
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Diese Website wird bei einem externen Dienstleister gehostet (Render Services, Inc). Die
                        personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern
                        des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen,
                        Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Webseitenzugriffe
                        und sonstige Daten, die über eine Website generiert werden, handeln.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
                        potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer
                        sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen
                        professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).

                        Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
                        potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer
                        sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen
                        professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
                        Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf
                        Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung
                        von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im
                        Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Unser(e) Hoster wird bzw. werden Ihre Daten nur insoweit verarbeiten, wie dies zur
                        Erfüllung seiner Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf
                        diese Daten befolgen.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir setzen folgende(n) Hoster ein:
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Render Web Services
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir hosten unsere Website bei Render Services, Inc.:
                        <br/>
                        Render Services, Inc.
                        <br/>
                        525 Brannan Street, Suite 300
                        <br/>
                        San Francisco, CA 94107, USA
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Datenübermittlung in die USA:</strong> Render hat Server in den USA. Die
                        Übermittlung von Daten in die USA erfolgt auf Grundlage von Standardvertragsklauseln
                        der EU-Kommission. Details finden Sie in den
                        <a
                            href="https://render.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ { color: '#1976d2', marginLeft: 4 } }
                        >
                            Datenschutzbestimmungen von Render
                        </a>.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Supabase (PostgreSQL Datenbank)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Für die Speicherung von Nutzerdaten verwenden wir Supabase Inc.:
                        <br/>
                        Supabase Inc.
                        <br/>
                        970 Toa Payoh North #07-04
                        <br/>
                        Singapore 318992
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Supabase nutzt AWS-Server in [REGION ANGEBEN - z.B. Frankfurt, EU].
                        [Falls Server außerhalb EU: Die Übermittlung erfolgt auf Grundlage von
                        Standardvertragsklauseln.] Details finden Sie in den
                        <a
                            href="https://supabase.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ { color: '#1976d2', marginLeft: 4 } }
                        >
                            Datenschutzbestimmungen von Supabase
                        </a>.
                    </Typography>
                </Box>

                {/* 4. Data Collection */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        4. Datenerfassung auf dieser Website
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Server-Log-Dateien
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
                        Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                    </Typography>
                    <Box component="ul" sx={ { pl: 4, mb: 2 } }>
                        <li>Browsertyp und Browserversion</li>
                        <li>verwendetes Betriebssystem</li>
                        <li>Referrer URL</li>
                        <li>Hostname des zugreifenden Rechners</li>
                        <li>Uhrzeit der Serveranfrage</li>
                        <li>IP-Adresse</li>
                    </Box>
                    <Typography variant="body1" paragraph>
                        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                        Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                        Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien
                        Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files
                        erfasst werden.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Registrierung auf dieser Website
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen.
                        Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen
                        Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung
                        abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir
                        die Registrierung ablehnen.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Für wichtige Änderungen etwa beim Angebotsumfang oder bei technisch notwendigen
                        Änderungen nutzen wir die bei der Registrierung angegebene E-Mail-Adresse, um Sie auf
                        diesem Wege zu informieren.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Welche Daten werden erhoben:</strong>
                    </Typography>
                    <Box component="ul" sx={ { pl: 4, mb: 2 } }>
                        <li>E-Mail-Adresse (Pflichtfeld)</li>
                        <li>Passwort (verschlüsselt gespeichert)</li>
                        <li>Name (optional)</li>
                        <li>Zeitstempel der Registrierung</li>
                        <li>IP-Adresse bei der Registrierung (zur Missbrauchsprävention)</li>
                    </Box>
                    <Typography variant="body1" paragraph>
                        Die Verarbeitung der bei der Registrierung eingegebenen Daten erfolgt auf Grundlage
                        Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können eine von Ihnen erteilte
                        Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an
                        uns. Die Rechtmäßigkeit der bereits erfolgten Datenverarbeitung bleibt vom Widerruf
                        unberührt.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange Sie auf
                        dieser Website registriert sind und werden anschließend gelöscht. Gesetzliche
                        Aufbewahrungsfristen bleiben unberührt.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Kontaktformular / E-Mail-Kontakt
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre
                        Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                        zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
                        sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
                        vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
                        Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
                        gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung
                        (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
                    </Typography>
                </Box>

                {/* 5. Cookies and Tracking */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        5. Cookies und Session-Management
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät
                        gespeichert werden und die Ihr Browser speichert. Cookies richten auf Ihrem Endgerät
                        keinen Schaden an und enthalten keine Viren.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Technisch notwendige Cookies
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir verwenden technisch notwendige Cookies, um die Funktionalität unserer Website zu
                        gewährleisten. Diese Cookies sind für die Nutzung der Website zwingend erforderlich und
                        benötigen keine Einwilligung:
                    </Typography>
                    <Box component="ul" sx={ { pl: 4, mb: 2 } }>
                        <li><strong>Session-Cookie:</strong> Speichert Ihre Anmeldung während einer Sitzung
                            (max. 15 Minuten nach Inaktivität)
                        </li>
                        <li><strong>CSRF-Token:</strong> Schützt vor Cross-Site-Request-Forgery-Angriffen</li>
                    </Box>
                    <Typography variant="body1" paragraph>
                        Die Speicherung dieser Cookies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                        Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von Cookies zur
                        technisch fehlerfreien und sicheren Bereitstellung seiner Dienste.
                    </Typography>
                </Box>

                {/* 6. User Rights */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        6. Ihre Rechte als betroffene Person
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Auskunftsrecht (Art. 15 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob wir Sie betreffende
                        personenbezogene Daten verarbeiten. Ist dies der Fall, haben Sie ein Recht auf Auskunft
                        über diese Daten sowie auf weitere Informationen wie Verarbeitungszwecke, Kategorien der
                        Daten, Empfänger etc.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Recht auf Berichtigung (Art. 16 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, unverzüglich die Berichtigung Sie betreffender unrichtiger
                        personenbezogener Daten zu verlangen.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Recht auf Löschung (Art. 17 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, die unverzügliche Löschung Sie betreffender personenbezogener Daten
                        zu verlangen, sofern einer der gesetzlichen Gründe zutrifft und soweit die Verarbeitung
                        nicht erforderlich ist.
                        <br/>
                        <strong>Hinweis:</strong> Sie können Ihr Benutzerkonto jederzeit selbst löschen über die
                        Kontoeinstellungen.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen, wenn eine der
                        gesetzlichen Voraussetzungen gegeben ist.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in einem strukturierten,
                        gängigen und maschinenlesbaren Format zu erhalten.
                        <br/>
                        <strong>Hinweis:</strong> Sie können Ihre Daten jederzeit exportieren über die
                        Kontoeinstellungen (Download als JSON).
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Widerspruchsrecht (Art. 21 DSGVO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben,
                        jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch
                        einzulegen.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Widerruf Ihrer Einwilligung
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
                        Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
                        der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={ { fontWeight: 600, mt: 2 } }>
                        Beschwerderecht bei einer Aufsichtsbehörde
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
                        Ihrer personenbezogenen Daten durch uns zu beschweren.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Zuständige Aufsichtsbehörde in Deutschland ist:
                        <br/>
                        <strong>Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit</strong>
                        <br/>
                        Graurheindorfer Str. 153
                        <br/>
                        53117 Bonn
                        <br/>
                        <a
                            href="https://www.bfdi.bund.de/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ { color: '#1976d2' } }
                        >
                            www.bfdi.bund.de
                        </a>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <em>
                            Je nach Bundesland kann auch die jeweilige Landesdatenschutzbehörde zuständig sein.
                            Eine vollständige Liste finden Sie
                            <a
                                href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={ { color: '#1976d2', marginLeft: 4 } }
                            >
                                hier
                            </a>.
                        </em>
                    </Typography>
                </Box>

                {/* 7. Data Retention */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        7. Speicherdauer
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde,
                        verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung
                        entfällt.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Benutzerkonto-Daten:</strong> Werden gespeichert, solange Ihr Konto aktiv ist.
                        Nach Löschung Ihres Kontos werden die Daten innerhalb von 30 Tagen vollständig gelöscht.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Session-Daten:</strong> Werden nach 15 Minuten Inaktivität automatisch gelöscht.
                    </Typography>
                </Box>

                {/* 8. Security */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        8. Datensicherheit
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket
                        Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser
                        unterstützt wird. In der Regel handelt es sich dabei um eine 256 Bit Verschlüsselung.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen,
                        um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen
                        Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere
                        Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Implementierte Sicherheitsmaßnahmen:</strong>
                    </Typography>
                    <Box component="ul" sx={ { pl: 4, mb: 2 } }>
                        <li>HTTPS/TLS-Verschlüsselung für alle Verbindungen</li>
                        <li>Passwort-Hashing mit bcrypt</li>
                        <li>CSRF-Schutz</li>
                        <li>Rate Limiting für API-Anfragen</li>
                        <li>Automatische Session-Timeouts (15 Minuten)</li>
                        <li>Regelmäßige Sicherheitsupdates</li>
                        <li>Verschlüsselte Datenbank-Verbindungen</li>
                    </Box>
                </Box>

                {/* 9. Data Processing Agreement */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        9. Auftragsverarbeitung
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir haben mit unseren Dienstleistern Verträge zur Auftragsverarbeitung (AVV) gemäß
                        Art. 28 DSGVO abgeschlossen. Diese garantieren, dass die Verarbeitung personenbezogener
                        Daten gemäß der DSGVO und zum Schutz der Rechte der betroffenen Person erfolgt.
                    </Typography>
                </Box>

                {/* 10. Changes */ }
                <Box sx={ { mb: 4 } }>
                    <Typography variant="h5" gutterBottom sx={ { fontWeight: 600 } }>
                        10. Änderungen dieser Datenschutzerklärung
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
                        rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der
                        Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services. Für Ihren
                        erneuten Besuch gilt dann die neue Datenschutzerklärung.
                    </Typography>
                </Box>

                <Divider sx={ { my: 4 } }/>

                <Typography variant="body2" color="text.secondary" align="center">
                    <strong>Letzte Aktualisierung:</strong> { new Date().toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) }
                    <br/>
                    <br/>
                    <em>
                        Für Fragen zum Datenschutz erreichen Sie uns unter der im Impressum angegebenen Adresse.
                    </em>
                </Typography>
            </Paper>
        </>
    );
}
