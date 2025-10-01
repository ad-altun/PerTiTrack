import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AccessibilityStatement from "../pages/legalRequirements/AccessibilityStatement.tsx";

export default function Footer() {
 const currentYear = new Date().getFullYear();

 return (
     <Box
         component="footer"
         sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
         }}
     >
      <Container maxWidth="lg">
       {/* Legal Links */}
       <Box
           sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 2 },
            mb: 2,
           }}
       >
        <Link
            to="/legal/impressum"
            style={{
             textDecoration: 'none',
             color: '#1976d2',
             fontSize: '0.875rem',
            }}
        >
         Impressum
        </Link>
        <Typography variant="body2" color="text.secondary">
         •
        </Typography>
        <Link
            to="/legal/privacy-policy"
            style={{
             textDecoration: 'none',
             color: '#1976d2',
             fontSize: '0.875rem',
            }}
        >
         Privacy Policy
        </Link>
           <Typography variant="body2" color="text.secondary">
               •
           </Typography>
           <Link
               to="/legal/terms-of-service"
               style={{
                   textDecoration: 'none',
                   color: '#1976d2',
                   fontSize: '0.875rem',
               }}
           >
               Terms of Service
           </Link>
        <Typography variant="body2" color="text.secondary">
         •
        </Typography>
        <Link
            to="/legal/accessibility-statement"
            style={{
             textDecoration: 'none',
             color: '#1976d2',
             fontSize: '0.875rem',
            }}
        >
            Accessibility
        </Link>
           <Typography variant="body2" color="text.secondary">
               •
           </Typography>
           <Link
               to="/legal/contact"
               style={{
                   textDecoration: 'none',
                   color: '#1976d2',
                   fontSize: '0.875rem',
               }}
           >
               Contact
           </Link>
       </Box>

       {/* Copyright */}
       <Typography
           variant="body2"
           color="text.secondary"
           align="center"
       >
        © {currentYear} PerTiTrack. Alle Rechte vorbehalten.
       </Typography>
      </Container>
     </Box>

 );
};
