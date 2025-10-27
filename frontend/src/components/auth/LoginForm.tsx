import * as React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "../../validation/authSchemas.ts";
import { loginSchema } from "../../validation/authSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useLoginMutation } from "../../store/api/authApi.ts";
import { setCredentials } from "../../store/slices/authSlice.ts";
import { useAppDispatch } from "../../store/hook.ts";


export default function LoginForm(): React.JSX.Element {
    const navigate = useNavigate();
    const [ loginMutation, { isLoading, error, isSuccess } ] = useLoginMutation();

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async ( data: LoginFormData ) => {
        try {
            const result = await loginMutation({
                email: data.email,
                password: data.password,
            }).unwrap();

            // navigate to dashboard
            // navigate('/dashboard');

            // Store credentials
            dispatch(setCredentials(result));
        }
        catch (error) {
            console.error('Login failed: ', error);
            // RTK Query automatically handles error
        }
    };

    // navigate on success
    useEffect(() => {
        if ( isSuccess ) {
            navigate('/dashboard');
        }
    }, [ isSuccess, navigate ]);

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
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to continue to your account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {typeof error === 'string' ? error : 'Invalid email or password'}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('email')}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={isLoading}
                        />
                        <TextField
                            {...register('password')}
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    Signing In...
                                </Box>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link
                                    to="/auth/register"
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
                                        Sign Up
                                    </Typography>
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );};
