import { createContext, useContext } from "react";
import type { ThemeMode } from "./ThemeContext.tsx";

interface ThemeContextTypes {
    mode: ThemeMode;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
    actualMode: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextTypes | undefined>(undefined);


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if ( context === undefined ) {
        throw new Error('useTheme must be used within a CustomThemeProvider');
    }
    return context;
};