import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "../../validation/authSchemas.ts";
import { loginSchema } from "../../validation/authSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useLoginMutation } from "../../store/api/authApi.ts";
import { useEffect } from "react";


export default function LoginForm(): React.JSX.Element {
    const navigate = useNavigate();
    const [ loginMutation, { isLoading, error, isSuccess } ] = useLoginMutation();

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
            await loginMutation({
                email: data.email,
                password: data.password,
            }).unwrap();

            // navigate to dashboard - storage is handled in the API
            // navigate('/dashboard');
        }
        catch ( error ) {
            console.error('Login failed: ', error);
            // Error is automatically handled by RTK Query
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
                sx={ {
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                } }>
                <Paper elevation={ 3 } sx={ { padding: 4, width: '100%' } }>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Welcome
                    </Typography>
                    <Typography variant={ "h6" } align={ "center" } color="text.secondary" gutterBottom>
                        Sign in to your account
                    </Typography>

                    { error && (
                        <Alert severity="error" sx={ { mb: 2 } }>
                            { typeof error === 'string' ? error : 'An error occured during login' }
                        </Alert>
                    ) }

                    <Box component={ "form" } sx={ { mt: 1 } }
                         onSubmit={ handleSubmit(onSubmit) }>
                        <TextField
                            { ...register('email') }
                            margin={ "normal" } required fullWidth id="email" label="Email Address"
                            name="email" autoComplete="email" autoFocus
                            error={ !!errors.email } helperText={ errors.email?.message }
                            disabled={ isLoading }
                        />
                        <TextField
                            { ...register('password') }
                            margin="normal" required fullWidth id="password" label="Password"
                            name="password" type="password" autoComplete="current-password"
                            error={ !!errors.password } helperText={ errors.password?.message }
                            disabled={ isLoading }
                        />

                        <Button type="submit" fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }
                                disabled={ isLoading } startIcon={ isLoading ? <CircularProgress size={ 20 }/> : null }
                        >
                            { isLoading ? 'Signing In...' : 'Sign In' }
                        </Button>

                        <Box sx={ { textAlign: 'center' } }>
                            <Link to="/forgot-password" style={ { textDecoration: 'none' } }>
                                <Typography variant="body2" sx={ { mt: 2 } } color={ "primary" }>
                                    Forgot your password?
                                </Typography>
                            </Link>

                            <Typography variant={ "body2" } sx={ { mt: 2 } }>
                                Don't have an account?{ ' ' }
                                <Link to="/register" style={ { textDecoration: 'none' } }>
                                    <Typography component={ "span" } variant="body2" color={ "primary" }>
                                        Sign Up
                                    </Typography>
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

        </Container>
    );
};
