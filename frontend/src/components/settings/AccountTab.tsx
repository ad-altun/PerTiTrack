import { useState } from "react";
import {
    Grid,
    CardContent,
    CardHeader,
    TextField,
    Button,
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
} from '@mui/icons-material';
import { SettingsCard, TabPanel } from '../../pages/SettingsPage.tsx';
import { useTheme as useMuiTheme } from "@mui/material/styles";


export default function AccountTab( { firstName, lastName, email }:
{ firstName: string, lastName: string, email: string } ) {
    const [ editingProfile, setEditingProfile ] = useState(false);

    const [ profileData, setProfileData ] = useState({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
    });

    const muiTheme = useMuiTheme();

 return (
    // Profile Tab Component
        <TabPanel>
            <SettingsCard>
                <CardHeader
                    sx={{
                        backgroundColor: muiTheme.palette.grey[500],
                        borderBottom: `1px solid ${muiTheme.palette.divider}`,
                    }}
                    title="Personal Information"
                    subheader="These information can only be edited by an administrator."
                    action={
                        <Button

                            disabled
                            startIcon={ editingProfile ? <Cancel/> : <Edit/> }
                            onClick={ () => setEditingProfile(!editingProfile) }
                            variant={ editingProfile ? "outlined" : "contained" }
                        >
                            { editingProfile ? 'Cancel' : 'Edit' }
                        </Button>
                    }
                />
                <CardContent>
                    <Grid
                        container spacing={ 3 }
                        direction="column"
                        sx={ { xs: 12, sm: 6, md: 3, lg: 2, bgcolor: muiTheme.palette.background.paper } }>
                        <Grid sx={ { xs: 12, sm: 6, borderRadius: '50%' } }>
                            <TextField
                                sx={ { width: '35%' } }
                                size="medium"
                                label="First Name"
                                value={profileData.firstName}
                                disabled={ !editingProfile }
                                onChange={ ( e ) => setProfileData(prev => ( { ...prev, firstName: e.target.value } )) }
                            />
                        </Grid>
                        <Grid sx={ { xs: 12, sm: 6 } }>
                            <TextField
                                sx={ { width: '35%' } }
                                label="Last Name"
                                value={profileData.lastName}
                                disabled={ !editingProfile }
                                onChange={ ( e ) => setProfileData(prev => ( { ...prev, lastName: e.target.value } )) }
                            />
                        </Grid>
                        <Grid sx={ { xs: 12, sm: 6 } }>
                            <TextField
                                sx={ { width: '35%' } }
                                label="Email"
                                value={profileData.email}
                                disabled={ !editingProfile }
                                onChange={ ( e ) => setProfileData(prev => ( { ...prev, email: e.target.value } )) }
                            />
                        </Grid>
                        { editingProfile && (
                            <Grid sx={ { xs: 12 } }>
                                <Button
                                    variant="contained"
                                    startIcon={ <Save/> }
                                    sx={ { mr: 2 } }
                                    onClick={ () => setEditingProfile(false) }
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={ <Cancel/> }
                                    onClick={ () => setEditingProfile(false) }
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        ) }
                    </Grid>
                </CardContent>
            </SettingsCard>
        </TabPanel>
 );
};
