import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Switch,
    FormControlLabel,
    Chip,
    Divider,
    Alert,
    styled,
    CardActionArea,
    useTheme as useMuiTheme, Stack,
} from '@mui/material';
import {
     DarkMode,
    Computer,
    Brightness7,
    Brightness4,
    LightMode, Check, SettingsSuggest,
} from '@mui/icons-material';
import { SettingsCard, TabPanel } from '../../pages/SettingsPage.tsx';
import { type ThemeMode } from "../../contexts/ThemeContext.tsx";
import { useTheme } from "../../contexts/UseTheme.tsx";

export default function GeneralTab() {

    const muiTheme = useMuiTheme();

    const SelectedBadge = styled(Chip)(({ theme }) => ({
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: '0.75rem',
        height: 24,
        '& .MuiChip-icon': {
            fontSize: 16,
            color: 'inherit',
        },
    }));

    const ThemeOptionCard = styled(Card, {
        shouldForwardProp: (prop) => prop !== 'isselected',
    })<{ isselected: boolean }>(({ theme, isselected }) => ({
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `2px solid ${isselected ? theme.palette.primary.main : 'transparent'}`,
        backgroundColor: isselected
            ? theme.palette.mode === 'dark'
                ? 'rgba(144, 202, 249, 0.08)'
                : 'rgba(25, 118, 210, 0.04)'
            : theme.palette.background.paper,
        '&:hover': {
            boxShadow: theme.shadows[4],
            borderColor: isselected ? theme.palette.primary.main : theme.palette.primary.light,
            transform: 'translateY(-2px)',
        },
        position: 'relative',
        overflow: 'visible',
    }));

    const ThemePreviewBox = styled(Box)<{ previewmode: string }>(({ previewmode, theme }) => ({
        width: '100%',
        height: 100,
        borderRadius: 8,
        background: (() => {
            switch (previewmode) {
                case 'light':
                    return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e0 100%)';
                case 'dark':
                    return 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)';
                case 'system':
                    return 'linear-gradient(to right, #f8fafc 0%, #e2e8f0 25%, #2d3748 75%, #1a202c 100%)';
                default:
                    return '#f5f5f5';
            }
        })(),
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
    }));

    const { mode, toggleMode, setMode, actualMode } = useTheme();



    const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
    };

    const themeOptions = [
        {
            value: 'light',
            label: 'Light Theme',
            shortLabel: 'Light',
            icon: <LightMode sx={{ fontSize: 28 }} />,
            description: 'Clean and bright interface perfect for daytime use',
            features: ['High contrast', 'Easy to read', 'Traditional look'],
        },
        {
            value: 'dark',
            label: 'Dark Theme',
            shortLabel: 'Dark',
            icon: <DarkMode sx={{ fontSize: 28 }} />,
            description: 'Easy on the eyes, perfect for low-light environments',
            features: ['Reduced eye strain', 'Battery saving', 'Modern look'],
        },
        {
            value: 'system',
            label: 'System Theme',
            shortLabel: 'System',
            icon: <Computer sx={{ fontSize: 28 }} />,
            description: 'Automatically adapts to your device preferences',
            features: ['Auto switching', 'OS integration', 'Smart adaptation'],
        },
    ]

    return (
        <TabPanel>
            <SettingsCard>
                <CardHeader
                    // sx={{
                    //     color: mode === 'system' ? 'primary.main' : 'text.secondary',
                    //     backgroundColor: 'rgb(255, 68, 51)',
                    // }}
                    title="Theme Preferences"
                    subheader="Choose how PerTiTrack looks and feels"
                    avatar={mode === 'light' ? <Brightness7 /> : mode === 'dark' ? <Brightness4 /> : <Computer />}
                />
                <CardContent>
                    {/* Current Theme Status */}
                    <Alert
                        severity="info"
                        sx={{ mb: 3 }}
                        icon={mode === 'light' ? <LightMode /> : mode === 'dark' ? <DarkMode /> : <SettingsSuggest />}
                    >
                        <Typography variant="body2">
                            <strong>Active theme:</strong> {themeOptions.find(opt => opt.value === mode)?.label}
                            {mode === 'system' && (
                                <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                                    Currently displaying: {actualMode} mode (following your system preference)
                                </Typography>
                            )}
                        </Typography>
                    </Alert>

                    {/* Theme Options Grid */}
                    <Grid container spacing={3}>
                        {themeOptions.map((option) => (
                            <Grid sx={{xs:12, md:4}} key={option.value}>
                                <ThemeOptionCard
                                    isselected={mode === option.value}
                                    onClick={() => handleThemeChange(option.value as ThemeMode)}
                                    // data-selected={mode === option.value ? 'true' : undefined}
                                >
                                    {mode === option.value && (
                                        <SelectedBadge
                                            icon={<Check />}
                                            label="Active"
                                            size="small"
                                        />
                                    )}
                                    <CardActionArea>
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Theme Preview */}
                                            <ThemePreviewBox previewmode={option.value}>
                                                <Box sx={{
                                                    color: option.value === 'dark' ? 'white' :
                                                        option.value === 'system' ? muiTheme.palette.text.primary :
                                                            '#2d3748',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}>
                                                    {option.icon}
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {option.shortLabel}
                                                    </Typography>
                                                </Box>
                                            </ThemePreviewBox>

                                            {/* Theme Details */}
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                {option.label}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {option.description}
                                            </Typography>

                                            {/* Features */}
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {option.features.map((feature, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={feature}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                            borderColor: mode === option.value ? 'primary.main' : 'divider',
                                                            color: mode === option.value ? 'primary.main' : 'text.secondary',
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </ThemeOptionCard>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Theme Information */}
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            About Themes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Your theme preference is automatically saved and will be remembered across all your sessions.
                            You can change it anytime from this settings page.
                        </Typography>

                        {mode === 'system' && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>System Theme:</strong> Your theme will automatically switch between light and dark
                                    based on your device's system preferences. This setting follows your operating system's
                                    theme schedule if you have one configured.
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                </CardContent>
            </SettingsCard>

            {/* Additional Settings */}
            <SettingsCard>
                <CardHeader
                    title="Display Settings"
                    subheader="Additional customization options"
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid sx={{ xs: 12, md:6 }}>
                            <TextField
                                fullWidth
                                label="Language"
                                value="English (US)"
                                disabled
                                helperText="Multiple languages coming soon"
                                size="small"
                            />
                        </Grid>
                        <Grid sx={{ xs: 12, md:6 }}>
                            <TextField
                                fullWidth
                                label="Time Zone"
                                value="UTC+02:00 (CEST)"
                                disabled
                                helperText="Auto-detected from your system"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </SettingsCard>
        </TabPanel>
    )
};

