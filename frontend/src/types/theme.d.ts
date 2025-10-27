import "@mui/material/styles";

declare module '@mui/material/styles' {

    // ------------ background colors -------------------

    interface TypeBackground {
        appBar: string;
        navBar: string;
        footer: string;
        cardSection: string;
        sectionHeader: string;
        cardItem: string;
        protocolHeader: string;
    }

    // augment the PaletteBackgroundOptions interface
    interface PaletteBackgroundOptions {
        default: string;    // already exists, but included for completeness
        paper: string;      // same as above
        // following ones added to style PerTiTrack
        appBar: string;
        navBar: string;
        footer: string;
        cardSection: string;
        sectionHeader: string;
        cardItem: string;
        protocolHeader: string;
    }

    // -------------------- text colors -------------------------

    interface TypeText {
        primary: string; // Already exists
        secondary: string; // Already exists
        muted: string;
        header: string;
        hover: string;
    }

    //     // augment the PaletteTextOptions interface
    interface PaletteTextOptions {
        primary: string; // Already exists
        secondary: string; // Already exists
        // custom for pertitrack app
        muted: string;
        header: string;
        hover: string;
    }

    // ------------------- custom Palette elements  ---------------------

    interface Palette {
        border: PaletteColor;
        shadow: PaletteColor;
        navItem: PaletteColor;
        navbar: {
            background: string;
            text: string;
            hover: string;
            active: string;
            border: string;
        };
    }

    interface PaletteOptions {
        border?: PaletteColorOptions;
        shadow?: PaletteColorOptions;
        navItem?: PaletteColorOptions;
        navbar?: {
            background?: string;
            text?: string;
            hover?: string;
            active?: string;
            border?: string;
        };
    }
}
