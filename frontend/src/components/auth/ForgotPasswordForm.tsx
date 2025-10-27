// import { useForgotPasswordMutation } from "../../store/api/authApi.ts";
// import { type ForgotPasswordFormData, forgotPasswordSchema } from "../../validation/authSchemas.ts";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//
//
// export default function ForgotPasswordForm() {
//     const [ forgotPasswordMutation, { isLoading, error, isSuccess } ] = useForgotPasswordMutation();
//     const [ successMessage, setSuccessMessage ] = useState<string>('');
//     const [ errorMessage, setErrorMessage ] = useState<string>('');
//
//     const {
//         register, handleSubmit, formState: { errors }, reset
//     } = useForm<ForgotPasswordFormData>({
//         resolver: zodResolver(forgotPasswordSchema),
//         defaultValues: {
//             email: '',
//         },
//     });
//
//     const onSubmit = async ( data: ForgotPasswordFormData ) => {
//         try {
//             setErrorMessage('');
//             setSuccessMessage('');
//             const result = await forgotPasswordMutation({
//                 email: data.email,
//             }).unwrap();
//             setSuccessMessage(result.message || 'Password reset email sent.');
//             reset();
//         }
//         catch (error) {
//             // const errorMessage = error?.data?.message || error?.message || 'An error occurred during forgot password';
//             const errorMessage = 'An error occurred during forgot password';
//             setErrorMessage(errorMessage);
//         }
//     };
//
//     return (
//         <Container component={ "main" } maxWidth="sm">
//             <Box
//                 sx={ { marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' } }
//             >
//                 <Paper elevation={ 3 } sx={ { padding: 4, width: '100%' } }>
//                     <Typography component="h1" variant="h4" align="center" gutterBottom>
//                         Forgot Password
//                     </Typography>
//                     <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
//                         Enter your email address to reset your password
//                     </Typography>
//
//                     { successMessage && (
//                         <Alert severity="success" sx={ { mb: 2 } }>
//                             { successMessage }
//                         </Alert>
//                     ) }
//
//                     { errorMessage && (
//                         <Alert severity="error" sx={ { mb: 2 } }>
//                             { errorMessage }
//                         </Alert>
//                     ) }
//
//                     <Box component={ "form" } onSubmit={ handleSubmit(onSubmit) } sx={ { mt: 3 } }>
//                         <TextField
//                             { ...register('email') }
//                             required
//                             fullWidth
//                             id="email"
//                             label="Email Address"
//                             name="email"
//                             autoComplete="email"
//                             error={ !!errors.email }
//                             helperText={ errors.email?.message }
//                             disabled={ isLoading }
//                             autoFocus
//                             margin="normal"
//                         />
//
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             sx={ { mt: 3, mb: 2 } }
//                             disabled={ isLoading }
//                             startIcon={ isLoading ? <CircularProgress size={ 20 }/> : null }
//                         >
//                             { isLoading ? 'Sending Email...' : 'Send Email' }
//                         </Button>
//
//                         <Box sx={ { textAlign: 'center' } }>
//                             <Link to="/auth/signin" style={ { textDecoration: 'none' } }>
//                                 <Button startIcon={ <ArrowBackIcon/> } variant="text" color="primary">
//                                     Back to Sign In
//                                 </Button>
//                             </Link>
//                         </Box>
//                     </Box>
//                 </Paper>
//             </Box>
//         </Container>
//     );
// };
