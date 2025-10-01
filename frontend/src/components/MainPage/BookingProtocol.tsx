import ProtocolTable from "../ProtocolTable.tsx";
import Paper from "@mui/material/Paper";

export default function BookingProtocol() {

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
         {/* Protocol Table */}
         <ProtocolTable  />
     </Paper>
 );
};
