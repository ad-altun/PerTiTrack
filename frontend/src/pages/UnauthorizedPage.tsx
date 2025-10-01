import { Box, Button, Paper, Typography } from "@mui/material";
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hook.ts";

export default function UnauthorizedPage({
    message = "You don't have permission to access this resource",
    showHomeButton = false
}) {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLoginRedirect = () => isAuthenticated ? logout() : navigate('/auth/signin');

    const handleGoHome = () => {
        navigate('/');
    }

    return (
        <Paper
            elevation={ 0 }
            sx={ {
                padding: '2rem',
                border: 'none',
                borderRadius: '0.5rem',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
        } }
        >
            <Box
                sx={ {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                } }
            >
                <SecurityIcon
                    sx={{
                        fontSize: '8rem',
                        color: '#f44336',
                        mb: 2
                    }}
                />

                {/* 401/403 Status */}
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: '6rem',
                        fontWeight: 'bold',
                        mb: 2,
                        color: '#f44336',
                    }}
                >
                    {isAuthenticated ? '403' : '401'}
                </Typography>

                {/* Main Title */}
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'text.primary'
                    }}
                >
                    {isAuthenticated ? 'Access Forbidden' : 'Authentication Required'}
                </Typography>

                {/* Error Message */}
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                    }}
                >
                    {message}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {!isAuthenticated && (
                        <Button
                            onClick={handleLoginRedirect}
                            variant="contained"
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                backgroundColor: '#1976d2',
                                borderRadius: '0.5rem',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            Sign In
                        </Button>
                    )}

                    {isAuthenticated && showHomeButton && (
                        <Button
                            onClick={handleGoHome}
                            variant="outlined"
                            size="large"
                            startIcon={<HomeIcon />}
                            sx={{
                                borderRadius: '0.5rem',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Go to Dashboard
                        </Button>
                    )}

                    {isAuthenticated && (
                        <Button
                            onClick={handleLoginRedirect}
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                borderRadius: '0.5rem',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Sign In to the Correct Account
                        </Button>
                    )}
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 3,
                        fontSize: '0.875rem'
                    }}
                >
                    If you believe this is an error, please contact your system administrator.
                </Typography>
            </Box>
        </Paper>
    );
};
