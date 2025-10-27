import React, { useState } from 'react';
import GeneralTab from '../components/settings/GeneralTab.tsx';
import AccountTab from '../components/settings/AccountTab.tsx';
import PrivacyTab from "../components/settings/PrivacyTab.tsx";
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Card,
    styled,
    useTheme as useMuiTheme,
    useMediaQuery
} from '@mui/material';
import {
    Security,
    SettingsBrightness,
    AccountBox,
} from '@mui/icons-material';
import { useAppSelector } from "../store/hook.ts";
import { selectCurrentUser } from "../store/slices/authSlice.ts";

export const SettingsCard = styled(Card)(( { theme } ) => ( {
    marginBottom: theme.spacing(3),
    '& .MuiCardHeader-root': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f7fafc',
        borderBottom: `1px solid ${ theme.palette.divider }`,
        color: theme.palette.mode === 'dark' ? 'primary.main' : 'text.secondary',
    },
} ));

export const TabPanel = styled(Box)(( { theme } ) => ( {
    paddingTop: theme.spacing(3),
} ));

const Settings = () => {
    const [ activeTab, setActiveTab ] = useState(0);

    const currentUser = useAppSelector(selectCurrentUser);
    const firstName = currentUser?.firstName || '';
    const lastName = currentUser?.lastName || '';
    const email = currentUser?.email || '';
    const userId = currentUser?.id || '';

    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    const availableTabs = [
        { id: 0, label: 'General', key: 'general', icon: <SettingsBrightness/> },
        { id: 1, label: 'Account', key: 'account', icon: <AccountBox/> },
        { id: 2, label: 'Privacy', key: 'privacy', icon: <Security/> },
    ];

    const renderTabContent = () => {
        switch ( activeTab ) {
            case 0:
                return <GeneralTab/>;
            case 1:
                return <AccountTab firstName={ firstName } lastName={ lastName } email={ email }/>;
            case 2:
                return <PrivacyTab userId={ userId }/>;
            default:
                return <GeneralTab/>;
        }
    };

    const handleTabChange = ( event: React.SyntheticEvent, newValue: number ) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={ { py: { xs: 2, sm: 3 } } }>
            {/* Page Header */ }
            <Paper sx={ { p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } } }>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={ {
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        color: muiTheme.palette.mode === 'dark' ? 'text.main' : 'text.secondary',
                        fontWeight: 'bold',
                    } }
                >
                    Settings
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={ { fontSize: { xs: '0.875rem', sm: '1rem' } } }
                >
                    Manage your account settings and preferences
                </Typography>
            </Paper>

            {/* Settings Content */ }
            <Paper sx={ {
                borderRadius: 2,
                overflow: 'hidden',
            } }>
                <Box sx={ {
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    minHeight: { xs: 'auto', sm: '500px' },
                } }>
                    {/* Left Sidebar - Tabs */ }
                    <Box sx={ {
                        width: 280,
                        backgroundColor: muiTheme.palette.mode === 'dark' ?
                            'rgba(255,255,255,0.02)' :
                            '#f7fafc',
                        borderRight: { xs: 'none', sm: `1px solid ${ muiTheme.palette.divider }` },
                        borderBottom: { xs: `1px solid ${ muiTheme.palette.divider }`, sm: 'none' },
                    } }>
                        <Tabs
                            orientation={ isMobile ? 'horizontal' : 'vertical' }
                            value={ activeTab }
                            onChange={ handleTabChange }
                            variant={ isMobile ? 'fullWidth' : 'standard' }
                            sx={ {
                                '& .MuiTab-root': {
                                    alignItems: { xs: 'center', sm: 'flex-start' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                    padding: { xs: '12px 16px', sm: '16px 24px' },
                                    minHeight: { xs: '64px', sm: 'auto' },
                                    borderBottom: {
                                        xs: 'none',
                                        sm: `1px solid ${ muiTheme.palette.divider }`
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: muiTheme.palette.background.paper,
                                        borderRight: {
                                            xs: 'none',
                                            sm: `3px solid ${ muiTheme.palette.primary.main }`
                                        },
                                        borderBottom: {
                                            xs: `3px solid ${ muiTheme.palette.primary.main }`,
                                            sm: `1px solid ${ muiTheme.palette.divider }`
                                        },
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none',
                                },
                            } }
                        >
                            { availableTabs.map(( tab ) => (
                                <Tab
                                    key={ tab.id }
                                    label={
                                        <Box
                                            sx={ {
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: 'center',
                                                gap: { xs: 0.5, sm: 1 },
                                            } }
                                        >
                                            { tab.icon }
                                            <Typography
                                                variant="body2"
                                                sx={ {
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    fontWeight: 500,
                                                } }
                                            >
                                                { tab.label }
                                            </Typography>
                                        </Box>
                                    }
                                />
                            )) }
                        </Tabs>
                    </Box>

                    {/*    Right content area for*/ }
                    <Box
                        sx={ {
                            flex: 1,
                            p: { xs: 2, sm: 3 },
                            overflowX: 'auto',
                        } }
                    >
                        { renderTabContent() }
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Settings;