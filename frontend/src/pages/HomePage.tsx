import Dashboard from "../components/MainPage/Dashboard.tsx";
import { Paper } from "@mui/material";

export default function HomePage() {
 return (
    <Paper sx={{ backgroundColor: 'background.default' }}>
        <Dashboard />
    </Paper>
 );
};
