import { useEffect } from "react";
import { Box } from '@mui/material';
import HeroSection from '../components/landingPage/HeroSection.tsx';
import FeaturesSection from "../components/landingPage/FeaturesSection.tsx";
import AboutSection from "../components/landingPage/AboutSection.tsx";
import ContactSection from "../components/ContactSection.tsx";

export default function HomePage() {
    // Smooth scroll behavior
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <Box
            component="main"
            role="main"
            sx={{
                backgroundColor: 'background.default',
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* About Section */}
            <AboutSection />

            {/* Contact Section */}
            {/*<ContactSection />*/}
        </Box>
    );
};
