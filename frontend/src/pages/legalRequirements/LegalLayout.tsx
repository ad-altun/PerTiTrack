import { Outlet, Link } from "react-router-dom";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import Header from "../../components/Header";
import Footer from "../../components/Footer.tsx";

export default function LegalLayout() {
 return (
     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
         {/* Simple header for legal pages */}
         <Header portalName="Rechtliche Informationen" />

         {/* Main content area */}
         <Container
             component="main"
             maxWidth="md"
             sx={{
                 flex: 1,
                 py: 4,
                 display: 'flex',
                 flexDirection: 'column'
             }}
         >
             <Outlet />
         </Container>
         {/* Footer with legal links */}
         <Footer />
     </Box>
 );
};
