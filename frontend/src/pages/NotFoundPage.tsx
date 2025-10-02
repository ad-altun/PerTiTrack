import { Box, Button, Paper, Typography } from "@mui/material";
import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={ 0 }
            sx={ {
                padding: '1.25rem',
                border: 'none',
                borderRadius: '.5rem',
            } }
        >
            <Box sx={ {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '90vh',
                textAlign: 'center',
            } }>
                <Typography
                    variant="h2" sx={ {
                    fontSize: '12rem', fontWeight: 'bold', mb: 4,
                    color: '#3FC8EE',
                } }
                >
                    404
                </Typography>
                <Typography variant="h3" sx={ { fontSize: '3rem', fontWeight: 'bold', mb: 8 } }>
                    Page Not Found
                </Typography>
                <Typography color="text.secondary" sx={ { mb: '3', fontSize: '2rem' } }>
                    The page you are looking for does not exist.
                </Typography>
                <Button
                    onClick={ () => navigate('/') }
                    size="large"
                    sx={ {
                        backgroundColor: '#3FC8EE', borderRadius: '2rem',
                        color: '#fff', fontWeight: 'bold', padding: '1.25rem 2.5rem',
                        fontSize: '1.25rem', mt: 6,
                        '&:hover': {
                            backgroundColor: '#3F71EE', color: '000', textTransform: 'none',
                            fontWeight: 'bold', fontSize: '1.2rem',
                        }
                    } }
                >
                    <HouseRoundedIcon sx={ { mr: .75, mb: .5, fontSize: '1.5rem', color: '#eff' } }/>
                    Return Home
                </Button>
            </Box>
        </Paper>
    );
};
