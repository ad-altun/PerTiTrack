import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Footer from "../../components/Footer.tsx";
import Navbar from "../../components/Navbar.tsx";

export default function LegalLayout() {
 return (
     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
         {/* Simple header for legal pages */}
         <Navbar />
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
