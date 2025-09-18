import { type BookingProtocolProps, bookingProtocolSchema } from "../../validation/protocolEntrySchema.ts";
import ProtocolTable from "../ProtocolTable.tsx";
import { Paper } from "@mui/material";
import ProtocolFilters from "../ProtocolFilters.tsx";


export default function BookingProtocol() {

    // Validate props using Zod
    // const validatedProps = bookingProtocolSchema.parse({ protocols });

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
         {/* Protocol Filters */}
         <ProtocolFilters />

         {/* Protocol Table */}
         <ProtocolTable  />
     </Paper>
 );
};
