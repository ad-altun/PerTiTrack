import React, { useState } from 'react';
import GeneralTab from '../components/settings/GeneralTab.tsx';
import AccountTab from '../components/settings/AccountTab.tsx';
import PrivacyTab from "../components/settings/PrivacyTab.tsx";
import {
    Box,
    Container,
    Paper,
    Typography,
    Tabs,
    Tab,
    Card,
    styled,
    useTheme as useMuiTheme,
} from '@mui/material';
import {
    Security,
    Business,
} from '@mui/icons-material';
import { useAppSelector } from "../store/hook.ts";
import { selectCurrentUser } from "../store/slices/authSlice.ts";

// Styled components
const SettingsContainer = styled(Container)(( { theme } ) => ( {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
} ));

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

    const availableTabs = [
        { id: 0, label: 'General', key: 'general', icon: <Business/> },
        { id: 1, label: 'Account', key: 'account', icon: <Business/> },
        { id: 2, label: 'Privacy', key: 'privacy', icon: <Security/> },
    ];

    const renderTabContent = () => {
        switch ( activeTab ) {
            case 0:
                return <GeneralTab/>;
            case 1:
                return <AccountTab firstName={firstName} lastName={lastName} email={email} />;
            case 2:
                return <PrivacyTab userId={userId} />;
            default:
                return <GeneralTab/>;
        }
    };

    const handleTabChange = ( event: React.SyntheticEvent, newValue: number ) => {
        setActiveTab(newValue);
    };

    return (
        <SettingsContainer maxWidth="xl">
            {/* Page Header */ }
            <Paper sx={ { p: 3, mb: 3 } }>
                <Typography variant="h4" component="h1"
                            sx={ { color: muiTheme.palette.mode === 'dark' ? 'text.main' : 'text.secondary',
                                fontWeight: 'bold', } }>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings and preferences
                </Typography>
            </Paper>

            {/* Settings Content */ }
            <Paper sx={ { borderRadius: 2, overflow: 'hidden' } }>
                <Box sx={ { display: 'flex', minHeight: '500px' } }>
                    {/* Left Sidebar - Tabs */ }
                    <Box sx={ {
                        width: 280,
                        backgroundColor: muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f7fafc',
                        borderRight: `1px solid ${ muiTheme.palette.divider }`
                    } }>
                        <Tabs
                            orientation="vertical"
                            value={ activeTab }
                            onChange={ handleTabChange }
                            sx={ {
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    padding: '16px 24px',
                                    minHeight: 'auto',
                                    borderBottom: `1px solid ${ muiTheme.palette.divider }`,
                                    '& .Mui-selected': {
                                        backgroundColor: muiTheme.palette.background.paper,
                                        borderRight: `3px solid ${ muiTheme.palette.primary.main }`,
                                    },
                                },
                            } }
                        >
                            { availableTabs.map(( tab ) => (
                                <Tab
                                    key={ tab.id }
                                    label={
                                        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                                            { tab.icon }
                                            { tab.label }
                                        </Box>
                                    }
                                />
                            )) }
                        </Tabs>
                    </Box>

                    {/*    Right content area for*/ }
                    <Box sx={ { flex: 1, p: 3 } }>
                        { renderTabContent() }
                    </Box>
                </Box>
            </Paper>
        </SettingsContainer>
    );
};

export default Settings;