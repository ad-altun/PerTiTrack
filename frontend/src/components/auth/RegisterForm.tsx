import { Alert, Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../store/api/authApi.ts";
import { type RegisterFormData, registerSchema } from "../../validation/authSchemas.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [ registerMutation, { isLoading } ] = useRegisterMutation();
    const [ successMessage, setSuccessMessage ] = useState<string>('');
    const [ errorMessage, setErrorMessage ] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, reset } =
        useForm<RegisterFormData>({
            resolver: zodResolver(registerSchema),
            defaultValues: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
        });

    const onSubmit = async ( data: RegisterFormData ) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');

            const result = await registerMutation({
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                firstName: data.firstName,
                lastName: data.lastName,
            }).unwrap();

            setSuccessMessage(result.message);
            reset();

            // navigate to login page after successful registration
            setTimeout(() => {
                navigate('/auth/signin');
            }, 2000);
        }
        catch {
            setErrorMessage("An error occurred during registration.");
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: 'calc(100vh - 100px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: { xs: 3, sm: 4 },
                        width: '100%',
                        maxWidth: 450,
                    }}
                >
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join PerTiTrack today
                        </Typography>
                    </Box>

                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {successMessage}
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <TextField
                                    {...register('firstName')}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    {...register('lastName')}
                                    autoComplete="family-name"
                                    name="lastName"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    {...register('email')}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    {...register('password')}
                                    name="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    {...register('confirmPassword')}
                                    name="confirmPassword"
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link
                                    to="/auth/signin"
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        fontWeight: 600,
                                    }}
                                >
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="primary"
                                        sx={{
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Sign In
                                    </Typography>
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );};
