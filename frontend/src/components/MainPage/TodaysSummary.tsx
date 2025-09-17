import { Box, Grid, Paper, Typography } from "@mui/material";
import { type TodaysSummaryProps, todaysSummarySchema } from "../../validation/todaysSummarySchema.ts";


export default function TodaysSummary({
    arrivalTime = "08:17:09",
    breakTime = "12:30:15 - 13:30:25",
    workingTime = "07:59:51",
    flexTime = "+00:29:51",
    status = "Working"
}: TodaysSummaryProps) {

    // Validate props using Zod
    const validatedProps = todaysSummarySchema.parse({
        arrivalTime,
        breakTime,
        workingTime,
        flexTime,
        status
    });

    const summaryItems = [
        { label: 'Arrival Time:', value: validatedProps.arrivalTime },
        { label: 'Break Time:', value: validatedProps.breakTime },
        { label: 'Working Time:', value: validatedProps.workingTime },
        { label: 'Flex Time:', value: validatedProps.flexTime, isFlexTime: true },
        { label: 'Status:', value: validatedProps.status, isStatus: true },
    ];

 return (
     <Paper
         elevation={2}
         sx={{
             backgroundColor: 'white',
             borderRadius: '8px',
             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
             overflow: 'hidden',
             marginBottom: '20px',
         }}
     >
         {/* Section Header */}
         <Box
             sx={{
                 backgroundColor: '#e2e8f0',
                 padding: '15px 20px',
                 fontWeight: 'bold',
                 color: '#2d3748',
                 borderBottom: '1px solid #cbd5e0',
             }}
         >
             <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                 Today's Summary
             </Typography>
         </Box>

         {/* Summary Content */}
         <Box sx={{ padding: '20px' }}>
             <Grid container spacing={2}>
                 {summaryItems.map((item, index) => (
                     <Grid size={ { xs:12, sm: 6, md: 12 } } key={index}>
                         <Box
                             sx={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 alignItems: 'center',
                                 padding: '12px 16px',
                                 backgroundColor: '#f7fafc',
                                 borderRadius: '6px',
                                 border: '1px solid #e2e8f0',
                                 marginBottom: index < summaryItems.length - 1 ? '8px' : 0,
                             }}
                         >
                             <Typography
                                 variant="body2"
                                 sx={{
                                     fontWeight: 600,
                                     color: '#4a5568',
                                     fontSize: '14px',
                                 }}
                             >
                                 {item.label}
                             </Typography>
                             <Typography
                                 variant="body2"
                                 sx={{
                                     color: item.isFlexTime
                                         ? (item.value.startsWith('+') ? '#38a169' : '#e53e3e')
                                         : item.isStatus
                                             ? '#2d3748'
                                             : '#2d3748',
                                     fontWeight: item.isFlexTime || item.isStatus ? 600 : 500,
                                     fontSize: '14px',
                                     fontFamily: item.isFlexTime ? 'monospace' : 'inherit',
                                 }}
                             >
                                 {item.value}
                             </Typography>
                         </Box>
                     </Grid>
                 ))}
             </Grid>

             {/* Additional Summary Stats */}
             <Box
                 sx={{
                     marginTop: '20px',
                     padding: '16px',
                     backgroundColor: '#edf2f7',
                     borderRadius: '8px',
                     border: '1px solid #cbd5e0',
                 }}
             >
                 <Typography
                     variant="body2"
                     sx={{
                         color: '#4a5568',
                         textAlign: 'center',
                         fontStyle: 'italic',
                         fontSize: '13px',
                     }}
                 >
                     Current work session in progress
                 </Typography>
             </Box>
         </Box>
     </Paper>
 );
};
