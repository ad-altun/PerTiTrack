import { type ReactNode, useCallback, useEffect, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeContext } from "./UseTheme.tsx";

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider = ( { children }: ThemeProviderProps ) => {
    const getSystemPreference = (): 'light' | 'dark' => {
        if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
            return 'dark';
        }
        return 'light';
    };

    const [ mode, setThemeMode ] = useState<ThemeMode>(() => {
        const localStorageMode = localStorage.getItem('theme-mode') as ThemeMode;
        if ( localStorageMode && [ 'light', 'dark', 'system' ].includes(localStorageMode) ) {
            return localStorageMode;
        }
        return 'system';
    });

    const resolveActualMode = useCallback((): 'light' | 'dark' => {
        if ( mode === 'system' ) {
            return getSystemPreference();
        }
        return mode as 'light' | 'dark';
    }, [ mode ]);

    const [ actualMode, setActualMode ] = useState<'light' | 'dark'>(() => resolveActualMode());

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
        setActualMode(resolveActualMode());
    }, [ mode, resolveActualMode ]);

    useEffect(() => {
        if ( mode === 'system' ) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => setActualMode(getSystemPreference());

            // set initial value
            setActualMode(getSystemPreference());

            // listen for changes
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [ mode ]);

    const toggleMode = () => {
        const modes: ThemeMode[] = [ 'light', 'dark', 'system' ];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = ( currentIndex + 1 ) % modes.length;
        setThemeMode(modes[ nextIndex ]);
    };

    const setMode = ( newMode: ThemeMode ) => {
        setThemeMode(newMode);
    };

    // actual MUI theme
    const theme = createTheme({
        palette: {
            mode: actualMode,
            ...( actualMode === "light"
                ? {
                    // primary: { main: "#4F46E5", light: "#6366F1", dark: "#3730A3" },
                    primary: {
                        main: "#6366F1",    // Indigo
                        light: "#818CF8",
                        dark: "#4338CA"
                    },
                    secondary: { main: "#10B981", light: "#34D399", dark: "#065F46" },
                    background: {
                        default: "#f8fafc", // body
                        paper: "white",
                        // appBar: "linear-gradient(0deg, #1e40af, #1e3a8a)",
                        appBar: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
                        navBar: "#1e293b",
                        sectionHeader: '#e0e7ff',
                        cardItem: '#f7fafc',
                        protocolHeader: '#e2e8f0',
                        cardSection: '#fff',
                    },
                    text: {
                        primary: "#2d3748",
                        secondary: "#4a5568",
                        muted: "#64748b",
                        header: "#FFFFFF",
                        hover: '#cbd5e1',
                    },
                    error: { main: "#EF4444", light: "#FCA5A5", dark: "#B91C1C" },
                    warning: { main: "#F59E0B", light: "#FCD34D", dark: "#B45309" },
                    success: { main: "#22C55E", light: "#86EFAC", dark: "#15803D" },
                    info: { main: "#3B82F6", light: "#93C5FD", dark: "#1E40AF" },
                    divider: "#E5E7EB",
                    action: {
                        active: "#4B5563",
                        hover: "rgba(79, 70, 229, 0.08)",
                        selected: "rgba(79, 70, 229, 0.12)",
                        disabled: "#9CA3AF",
                        disabledBackground: "#F3F4F6",
                    },
                    border: {
                        light: '#c2cad6',
                        main: '#cbd5e0',
                        dark: '#e2e8f0',
                    },
                    shadow: {
                        light: 'rgba(0,0,0,0.15)',
                        main: '#9CA3AF',
                        dark: '#9CA3AF',
                    },
                    // navItem: {
                    //     default: "#334155",
                    //     hover: "#475569",
                    //     active: "#2563eb",
                    // },
                    navItem: {
                        default: "rgba(255, 255, 255, 0.1)",
                        hover: "rgba(255, 255, 255, 0.2)",
                        active: "rgba(255, 255, 255, 0.25)",
                    },
                    navbar: {
                        background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
                        text: "#FFFFFF",
                        hover: "rgba(255, 255, 255, 0.15)",
                        active: "rgba(255, 255, 255, 0.25)",
                        border: "rgba(255, 255, 255, 0.1)",
                    },
                }
                : {
                    // Dark mode colors
                    primary: { main: "#818CF8", light: "#A5B4FC", dark: "#4338CA" },
                    secondary: { main: "#34D399", light: "#6EE7B7", dark: "#065F46" },
                    background: {
                        default: "#0F172A",
                        paper: "#1E293B",
                        // appBar: "linear-gradient(0deg, #1e40af, #1e3a8a)",
                        appBar: "linear-gradient(135deg, #312E81 0%, #4338CA 100%)",
                        // navBar: "#2d3748",
                        navBar: "#0f172a",
                        sectionHeader: "#334155",
                        protocolHeader: '#e2e8f0',
                        cardItem: '#f7fafc',
                        cardSection: '#334155',
                    },
                    text: {
                        primary: "#F9FAFB",
                        secondary: "#cbd5e1",
                        header: "#f1f5f9",
                        hover: '#4a5568',
                    },
                    error: { main: "#F87171", light: "#FCA5A5", dark: "#B91C1C" },
                    warning: { main: "#FBBF24", light: "#FCD34D", dark: "#B45309" },
                    success: { main: "#4ADE80", light: "#86EFAC", dark: "#15803D" },
                    info: { main: "#60A5FA", light: "#93C5FD", dark: "#1E40AF" },
                    divider: "#334155",
                    action: {
                        active: "#94A3B8",
                        hover: "rgba(129, 140, 248, 0.12)",
                        selected: "rgba(129, 140, 248, 0.16)",
                        disabled: "#475569",
                        disabledBackground: "#334155",
                    },
                    border: {
                        light: '#bebfbf',
                        main: '#475569',
                        dark: '#e2e8f0',
                    },
                    shadow: {
                        light: 'rgba(0,0,0,0.08)',
                        main: '#9CA3AF',
                        dark: '#9CA3AF',
                    },
                    // navItem: {
                    //     default: "#1e293b",
                    //     hover: "#334155",
                    //     active: "#3b82f6",
                    //     text: '#e2e8f0',
                    // },
                    // Dark mode navbar colors
                    navItem: {
                        default: "rgba(255, 255, 255, 0.08)",
                        hover: "rgba(255, 255, 255, 0.15)",
                        active: "rgba(129, 140, 248, 0.25)",
                        text: '#F1F5F9',
                    },
                    navbar: {
                        background: "linear-gradient(135deg, #312E81 0%, #4338CA 100%)",
                        text: "#F1F5F9",
                        hover: "rgba(255, 255, 255, 0.1)",
                        active: "rgba(129, 140, 248, 0.2)",
                        border: "rgba(255, 255, 255, 0.1)",
                    },
                } ),

        },
        typography: {
            fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
            h1: { fontWeight: 700, fontSize: "2rem" },      // 32px instead 96px
            h2: { fontWeight: 600, fontSize: "1.75rem" },   // 28px instead 60px
            h3: { fontWeight: 600, fontSize: "1.5rem" },    // 24px instead 48px
            h4: { fontWeight: 600, fontSize: "1.25rem" },    // 20px instead 34px
            h5: { fontWeight: 600, fontSize: "1.125rem" },  // 18px ...
            h6: { fontWeight: 600, fontSize: "1rem" },      // 16 px ...
            body1: { fontSize: "0.95rem", lineHeight: 1.6 },
            button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: "8px", padding: "6px 16px" },
                    contained: {
                        boxShadow: "none",
                        "&:hover": { boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: "12px",
                        boxShadow:
                            actualMode === "light"
                                ? "0 2px 6px rgba(0,0,0,0.05)"
                                : "0 2px 8px rgba(0,0,0,0.4)",
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        boxShadow: "none",
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        minWidth: "240px",
                    },
                    indicator: {
                        backgroundColor: actualMode === "light" ? "#6366F1" : "#818CF8",
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: ( { theme } ) => ( {
                        alignItems: "center",
                        textAlign: "center",
                        fontWeight: 500,
                        minWidth: "60px", // Smaller minimum width for mobile
                        padding: "12px 8px", // Reduce padding on mobile
                        [ theme.breakpoints.up('sm') ]: {
                            minWidth: "120px",
                            padding: "12px 16px",
                        },
                        "&.Mui-selected": {
                            color: actualMode === "light" ? "#6366F1" : "#A5B4FC",
                            backgroundColor:
                                actualMode === "light" ? "rgba(99, 102, 241, 0.08)" : "rgba(129,140,248,0.12)",
                        },
                    } ),
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        borderRadius: "8px",
                        margin: "4px 8px",
                        textTransform: 'none',
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: "6px",
                        fontWeight: 500,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: "12px",
                        backgroundImage: "none",
                    },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        backgroundColor: actualMode === "light" ? "#F3F4F6" : "#1E293B",
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 600,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: actualMode === "light" ? "#FFFFFF" : "#1E293B",
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: "8px",
                    },
                },
            },
            MuiSkeleton: {
                styleOverrides: {
                    root: {
                        backgroundColor: actualMode === "light"
                            ? "rgba(0, 0, 0, 0.11)"
                            : "rgba(129, 140, 248, 0.2)",
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={ { mode, toggleMode, setMode, actualMode } }>
            <MuiThemeProvider theme={ theme }>
                <CssBaseline/>
                { children }
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

