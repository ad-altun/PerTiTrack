import { Box } from "@mui/material";
import WelcomeSection from "./WelcomeSection.tsx";
import BookingPanel from "./BookingPanel.tsx";
import TodaysSummary from "./TodaysSummary.tsx";
import BookingProtocol from "./BookingProtocol.tsx";

export default function Dashboard() {

    return (
        <Box
            sx={{
                paddingBlock: '20px',
                bgColor: '#f5f5f5',
                background: 'background.default',
            }}
        >
            <WelcomeSection />

            {/* Main Content - Following the HTML design layout */}
            <Box sx={{
                display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Booking Container */}
                <Box sx={{
                    display: 'flex', gap: '20px',
                    flexDirection: { xs: 'column', md:'row' },
                    alignItems: {xs: 'center', md: 'flex-start'},
                }}>
                    {/* Left Panel - Booking Actions */}
                    <Box sx={{ flex: 1, maxWidth: { xs: 'auto', md: '30rem' },
                        width: '100%', }}>
                        <BookingPanel />
                    </Box>

                    {/* Right Panel - Today's Summary */}
                    <Box sx={{ flex: 2 }}>
                        <TodaysSummary />
                    </Box>
                </Box>

                {/* Booking Protocol Section */}
                <BookingProtocol />
            </Box>
        </Box>
    );
};
