import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeIcon from '@mui/icons-material/Home';

export default function UnderConstructionPage() {
    const navigate = useNavigate();

 return (
     <Container maxWidth="md">
         <Box
             sx={{
                 minHeight: '70vh',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 py: 8,
             }}
         >
             <Paper
                 elevation={3}
                 sx={{
                     p: 6,
                     textAlign: 'center',
                     borderRadius: 2,
                     maxWidth: 600,
                 }}
             >
                 {/* Icon */}
                 <Box
                     sx={{
                         display: 'flex',
                         justifyContent: 'center',
                         mb: 3,
                     }}
                 >
                     <ConstructionIcon
                         sx={{
                             fontSize: 120,
                             color: 'warning.main',
                             animation: 'rotate 2s linear infinite',
                             '@keyframes rotate': {
                                 '0%': { transform: 'rotate(0deg)' },
                                 '100%': { transform: 'rotate(360deg)' },
                             },
                         }}
                     />
                 </Box>

                 {/* Title */}
                 <Typography
                     variant="h3"
                     component="h1"
                     gutterBottom
                     sx={{ fontWeight: 600, color: 'text.primary' }}
                 >
                     Under construction
                 </Typography>

                 {/* Subtitle */}
                 <Typography
                     variant="h6"
                     color="text.secondary"
                     sx={{ mb: 3 }}
                 >
                     This site is currently under development
                 </Typography>

                 {/* Description */}
                 <Typography
                     variant="body1"
                     color="text.secondary"
                     paragraph
                     sx={{ mb: 4 }}
                 >
                     We are working on providing you with new features soon. Thank you for your patience!
                 </Typography>

                 {/* Action Buttons */}
                 <Box
                     sx={{
                         display: 'flex',
                         gap: 2,
                         justifyContent: 'center',
                         flexWrap: 'wrap',
                     }}
                 >
                     <Button
                         variant="contained"
                         size="large"
                         startIcon={<HomeIcon />}
                         onClick={() => navigate('/')}
                         sx={{ textTransform: 'none' }}
                     >
                         Back to the Homepage
                     </Button>
                     <Button
                         variant="outlined"
                         size="large"
                         onClick={() => navigate(-1)}
                         sx={{ textTransform: 'none' }}
                     >
                         Go Back
                     </Button>
                 </Box>

                 {/* Additional Info */}
                 <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                     <Typography variant="caption" color="text.secondary">
                         If you have any questions, please contact us via the contact page
                     </Typography>
                 </Box>
             </Paper>
         </Box>
     </Container>
 );
};
