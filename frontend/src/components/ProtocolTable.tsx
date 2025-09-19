import type { ProtocolEntry, BookingProtocolProps } from "../validation/protocolEntrySchema.ts";
import {
 Table,
 TableHead,
 TableBody,
 TableRow,
 TableCell,
 TableContainer,
 Chip,
 Box
} from '@mui/material';
import ProtocolWorkSummary from "./ProtocolWorkSummary.tsx";

// interface ProtocolTableProps {
//  protocols: ProtocolEntry[];
// }

// export default function ProtocolTable({ protocols}: ProtocolTableProps = { protocols: []}) {
export default function ProtocolTable() {

 const protocols: BookingProtocolProps = [];

 // Default sample data if no protocols provided
 const defaultProtocols: ProtocolEntry[] = [
  {
   id: '1',
   date: '01/22/2025',
   time: '08:17:09',
   booking: 'A0 Arrival',
   bookingType: 'arrival',
   terminal: 'Web Terminal',
   workSummary: 'Started working on user authentication module for the project'
  },
  {
   id: '2',
   date: '01/22/2025',
   time: '12:30:15',
   booking: 'B1 Break Start',
   bookingType: 'break',
   terminal: 'Web Terminal',
   workSummary: 'Lunch break'
  },
  {
   id: '3',
   date: '01/22/2025',
   time: '13:30:25',
   booking: 'B2 Break End',
   bookingType: 'break',
   terminal: 'Web Terminal',
   workSummary: 'Back from lunch break'
  },
  {
   id: '4',
   date: '01/22/2025',
   time: '17:45:33',
   booking: 'G0 Departure',
   bookingType: 'departure',
   terminal: 'Web Terminal',
   workSummary: 'Completed API endpoints for time tracking, ready for frontend integration'
  }
 ];

 const protocolData = protocols.length > 0 ? protocols : defaultProtocols;

 const getBookingChipColor = (bookingType: string) => {
  switch (bookingType) {
   case 'arrival':
    return { backgroundColor: '#c6f6d5', color: '#22543d' }; // Green
   case 'break':
    return { backgroundColor: '#fed7d7', color: '#742a2a' }; // Red
   case 'departure':
    return { backgroundColor: '#bee3f8', color: '#2a4365' }; // Blue
   default:
    return { backgroundColor: '#e2e8f0', color: '#2d3748' }; // Gray
  }
 };


 return (
     <TableContainer>
      <Table sx={{ minWidth: 650 }}>
       <TableHead>
        <TableRow>
         {['Date', 'Time', 'Booking', 'Terminal', 'Work Summary'].map((header) => (
             <TableCell
                 key={header}
                 sx={{
                  backgroundColor: '#e2e8f0',
                  padding: '12px 8px',
                  fontWeight: 600,
                  color: '#2d3748',
                  borderBottom: '1px solid #cbd5e0',
                  fontSize: '14px',
                 }}
             >
              {header}
             </TableCell>
         ))}
        </TableRow>
       </TableHead>
       <TableBody>
        {protocolData.map((protocol, index) => (
            <TableRow
                key={protocol.id}
                sx={{
                 backgroundColor: index % 2 === 0 ? 'white' : '#f7fafc',
                 '&:hover': {
                  backgroundColor: '#edf2f7',
                 },
                }}
            >
             <TableCell
                 sx={{
                  padding: '8px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#4a5568',
                  fontSize: '13px',
                 }}
             >
              {protocol.date}
             </TableCell>
             <TableCell
                 sx={{
                  padding: '8px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#4a5568',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                 }}
             >
              {protocol.time}
             </TableCell>
             <TableCell
                 sx={{
                  padding: '8px',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '13px',
                 }}
             >
              <Chip
                  label={protocol.booking}
                  size="small"
                  sx={{
                   ...getBookingChipColor(protocol.bookingType),
                   fontSize: '11px',
                   fontWeight: 500,
                   height: '24px',
                  }}
              />
             </TableCell>
             <TableCell
                 sx={{
                  padding: '8px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#4a5568',
                  fontSize: '13px',
                 }}
             >
              {protocol.terminal}
             </TableCell>
             <TableCell
                 sx={{
                  padding: '8px',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '13px',
                  maxWidth: '300px',
                 }}
             >
              <ProtocolWorkSummary
                  id={protocol.id}
                  workSummary={protocol.workSummary}
              />
             </TableCell>
            </TableRow>
        ))}
       </TableBody>
      </Table>
     </TableContainer>
 );
};
