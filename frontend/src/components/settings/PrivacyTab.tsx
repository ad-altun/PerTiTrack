import {
    Typography,
    Grid,
    CardContent,
    CardHeader,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    IconButton, InputAdornment,
} from '@mui/material';
import {
    Save,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { SettingsCard, TabPanel } from '../../pages/SettingsPage.tsx';
import { useEffect, useState } from "react";
import { useChangePasswordMutation } from "../../store/api/settingsApi.ts";
import {
    type PasswordChange,
    passwordChangeSchema
} from "../../validation/settingsSchemas.ts";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../store/slices/authSlice.ts";
import { useAppDispatch } from "../../store/hook.ts";

export default function PrivacyTab({ userId }: { userId: string}) {
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ passwords, setPasswords ] = useState<PasswordChange>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [ systemSettings, setSystemSettings ] = useState({
        sessionTimeout: 15,
        autoLogout: true,
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // RTK Query mutation
    const [ changePassword,
        { isLoading: changePasswordLoading, isSuccess: changePasswordSuccess } ] =
        useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordChange>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }
    })

    const onSubmit = async ( data: PasswordChange ) => {
        try {
            await changePassword({
                userId: userId,
                passwords: {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword,
                }
            }).unwrap();
        } catch (e) {
            console.log("An error occurred during password change: ", e);
        }
    };

    // navigate on password change success
    useEffect(() => {
        if ( changePasswordSuccess ) {
            setTimeout(() => {
                // window.location.reload();
                dispatch(clearCredentials());
                navigate('/login');
            }, 2000);
        }
    }, [ changePasswordSuccess, navigate, dispatch ])

    return (
        // Security Tab Component
        <TabPanel>
            <SettingsCard>
                <CardHeader title="Change Password"/>
                <CardContent >
                    <Grid component={"form"} container spacing={ 3 }
                        onSubmit={ handleSubmit(onSubmit) } >
                        <Grid sx={ { xs: 12 } }>
                            <TextField
                                {...register('currentPassword')}
                                fullWidth required id="currentPassword"
                                error={ !!errors.currentPassword }
                                helperText={ errors.currentPassword?.message }
                                disabled={ changePasswordLoading }
                                autoFocus
                                type={ showPassword ? 'text' : 'password' }
                                label="Current Password"
                                value={ passwords.currentPassword }
                                onChange={ ( e ) => setPasswords(
                                    prev => ( { ...prev, currentPassword: e.target.value } )
                                ) }
                                slotProps={ {
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position={"end"}>
                                                <IconButton onClick={ () => setShowPassword(!showPassword) }>
                                                    { showPassword ? <VisibilityOff/> : <Visibility/> }
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                } }
                            />
                        </Grid>
                        <Grid sx={ { xs: 12, sm: 6 } }>
                            <TextField
                                {...register('newPassword')}
                                fullWidth required id="newPassword"
                                error={ !!errors.newPassword }
                                helperText={ errors.newPassword?.message }
                                disabled={ changePasswordLoading }
                                type="password"
                                label="New Password"
                                value={ passwords.newPassword }
                                onChange={ ( e ) => setPasswords(
                                    prev => ( { ...prev, newPassword: e.target.value } )) }
                            />
                        </Grid>
                        <Grid sx={ { xs: 12, sm: 6 } }>
                            <TextField
                                { ...register('confirmPassword') }
                                fullWidth required id="confirmPassword"
                                error={ !!errors.confirmPassword }
                                helperText={ errors.confirmPassword?.message }
                                disabled={ changePasswordLoading }
                                type="password"
                                label="Confirm New Password"
                                value={ passwords.confirmPassword }
                                onChange={ ( e ) => setPasswords(
                                    prev => ( { ...prev, confirmPassword: e.target.value } )) }
                            />
                        </Grid>
                        <Grid sx={ { xs: 12 } }>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={ changePasswordLoading }
                                startIcon={ !changePasswordLoading ? <Save /> : null }
                            >
                                Update Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </SettingsCard>

            <SettingsCard>
                <CardHeader title="Session Settings"/>
                <CardContent>
                    <FormControlLabel
                        control={
                            <Switch
                                disabled
                                checked={ systemSettings.autoLogout }
                                onChange={ ( e ) => setSystemSettings(
                                    prev => ( { ...prev, autoLogout: e.target.checked } )) }
                            />
                        }
                        label="Auto-logout after inactivity"
                    />
                    <Typography variant="body2" color="text.secondary" sx={ { mt: 1 } }>
                        Current session timeout: { systemSettings.sessionTimeout } minutes
                    </Typography>
                </CardContent>
            </SettingsCard>
        </TabPanel>
    );
};
