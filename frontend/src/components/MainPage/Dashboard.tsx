import { Box, Container } from "@mui/material";
import WelcomeSection from "./WelcomeSection.tsx";
import BookingPanel from "./BookingPanel.tsx";
import TodaysSummary from "./TodaysSummary.tsx";
import BookingProtocol from "./BookingProtocol.tsx";

export default function Dashboard() {

    return (
        <Container
            maxWidth="xl"
            sx={{
                padding: '20px',
                marginTop: 0,
            }}
        >
            <WelcomeSection />

            {/* Main Content - Following the HTML design layout */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Booking Container */}
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    {/* Left Panel - Booking Actions */}
                    <Box sx={{ flex: 1, maxWidth: '30rem' }}>
                        <BookingPanel />
                    </Box>

                    {/* Right Panel - Today's Summary */}
                    <Box sx={{ flex: 2 }}>
                        <TodaysSummary
                            arrivalTime="08:17:09"
                            breakTime="12:30:15 - 13:30:25"
                            workingTime="07:59:51"
                            flexTime="+00:29:51"
                            status="Working"
                        />
                    </Box>
                </Box>

                {/* Booking Protocol Section */}
                <BookingProtocol protocols={[]} />
            </Box>
        </Container>
    );
};
