import { type ReactNode, useCallback, useEffect, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeContext} from "./UseTheme.tsx";

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
    const [mode, setThemeMode] = useState<ThemeMode>(() => {
        const localStorageMode = localStorage.getItem('theme-mode') as ThemeMode;
        if (localStorageMode && ['light', 'dark'].includes(localStorageMode)) {
            return localStorageMode;
        }
        return 'system';
    });

    const getSystemPreference = (): 'light' | 'dark' => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const resolveActualMode = useCallback((): 'light' | 'dark' => {
        if (mode === 'system') {
            return getSystemPreference();
        }
        return mode as 'light' | 'dark';
    }, [mode]);

    const [actualMode, setActualMode] = useState<'light' | 'dark'>(resolveActualMode);

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
        setActualMode(resolveActualMode());
    }, [mode, resolveActualMode]);

    useEffect(() => {
        if (mode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => setActualMode(getSystemPreference());
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [mode]);

    const toggleMode = () => {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setThemeMode(modes[nextIndex]);
    };

    const setMode = (newMode: ThemeMode) => {
        setThemeMode(newMode);
    };

    // actual MUI theme
    const theme = createTheme({
        palette: {
            mode: actualMode,
            ...(actualMode === "light"
                ? {
                    primary: { main: "#4F46E5", light: "#6366F1", dark: "#3730A3" },
                    secondary: { main: "#10B981", light: "#34D399", dark: "#065F46" },
                    background: { default: "#F9FAFB", paper: "#FFFFFF" },
                    text: { primary: "#111827", secondary: "#4B5563" },
                    error: { main: "#EF4444" },
                    warning: { main: "#F59E0B" },
                    success: { main: "#22C55E" },
                }
                : {
                    primary: { main: "#818CF8", light: "#A5B4FC", dark: "#4338CA" },
                    secondary: { main: "#34D399", light: "#6EE7B7", dark: "#065F46" },
                    background: { default: "#0F172A", paper: "#1E293B" },
                    text: { primary: "#F9FAFB", secondary: "#9CA3AF" },
                    error: { main: "#F87171" },
                    warning: { main: "#FBBF24" },
                    success: { main: "#4ADE80" },
                }),
        },
        typography: {
            fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
            h1: { fontWeight: 700, fontSize: "2rem" },
            h2: { fontWeight: 600, fontSize: "1.75rem" },
            h3: { fontWeight: 600, fontSize: "1.5rem" },
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
                        backgroundColor: actualMode === "light" ? "#4F46E5" : "#818CF8",
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        alignItems: "flex-start",
                        textAlign: "left",
                        fontWeight: 500,
                        "&.Mui-selected": {
                            color: actualMode === "light" ? "#4F46E5" : "#A5B4FC",
                            backgroundColor:
                                actualMode === "light" ? "rgba(79,70,229,0.05)" : "rgba(129,140,248,0.1)",
                        },
                    },
                },
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
                    },
                },
            },
        },
    });

 return (
     <ThemeContext.Provider value={{ mode, toggleMode, setMode, actualMode }}>
         <MuiThemeProvider theme={theme}>
             <CssBaseline />
             {children}
         </MuiThemeProvider>
     </ThemeContext.Provider>
 );
}

