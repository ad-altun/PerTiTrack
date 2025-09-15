import { Search } from "@mui/icons-material";
import { Box, FormControl, Select, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";


export default function ProtocolFilters() {
 return (
     <Box
         sx={{
             padding: '15px 20px',
             backgroundColor: '#f7fafc',
             borderBottom: '1px solid #e2e8f0',
             display: 'flex',
             alignItems: 'center',
             gap: '15px',
             flexWrap: 'wrap',
         }}
     >
         {/* Filter Group 1 - Time Period */}
         <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Typography
                 variant="body2"
                 sx={{
                     fontWeight: 600,
                     color: '#4a5568',
                     minWidth: '80px',
                 }}
             >
                 Time Period:
             </Typography>
             <FormControl size="small" sx={{ minWidth: 150 }}>
                 <Select
                     value="today"
                     sx={{
                         backgroundColor: 'white',
                         fontSize: '14px',
                         '& .MuiOutlinedInput-notchedOutline': {
                             borderColor: '#cbd5e0',
                         },
                     }}
                 >
                     <MenuItem value="today">Today</MenuItem>
                     <MenuItem value="thisWeek">This Week</MenuItem>
                     <MenuItem value="thisMonth">This Month</MenuItem>
                     <MenuItem value="custom">Custom Range</MenuItem>
                 </Select>
             </FormControl>
         </Box>

         {/* Filter Group 2 - Booking Type */}
         <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Typography
                 variant="body2"
                 sx={{
                     fontWeight: 600,
                     color: '#4a5568',
                     minWidth: '80px',
                 }}
             >
                 Booking Type:
             </Typography>
             <FormControl size="small" sx={{ minWidth: 120 }}>
                 <Select
                     value="all"
                     sx={{
                         backgroundColor: 'white',
                         fontSize: '14px',
                         '& .MuiOutlinedInput-notchedOutline': {
                             borderColor: '#cbd5e0',
                         },
                     }}
                 >
                     <MenuItem value="all">All Types</MenuItem>
                     <MenuItem value="arrival">Arrival</MenuItem>
                     <MenuItem value="break">Break</MenuItem>
                     <MenuItem value="departure">Departure</MenuItem>
                 </Select>
             </FormControl>
         </Box>

         {/* Search Box */}
         <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
             <Typography
                 variant="body2"
                 sx={{
                     fontWeight: 600,
                     color: '#4a5568',
                 }}
             >
                 Search:
             </Typography>
             <TextField
                 size="small"
                 placeholder="Search work summary..."
                 sx={{
                     minWidth: 200,
                     '& .MuiOutlinedInput-root': {
                         backgroundColor: 'white',
                         fontSize: '14px',
                         '& fieldset': {
                             borderColor: '#cbd5e0',
                         },
                     },
                 }}
                 InputProps={{
                     startAdornment: (
                         <Search sx={{ color: '#a0aec0', marginRight: 1, fontSize: 18 }} />
                     ),
                 }}
             />
         </Box>
     </Box>
 );
};
