import { useState } from "react";
import { Box, Typography, IconButton } from '@mui/material';
import {
    AccessTime,
    Cancel,
    Home,
    Flight,
    HelpOutline,
    Login
} from '@mui/icons-material';
import { actionButtonsSchema, type ActionButtonsProps, type ActionType } from "../validation/actionButtonsSchema.ts";


interface ActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
    active?: boolean;
}

export default function ActionButton({
    activeAction = 'clockIn',
    onActionClick
}: ActionButtonsProps) {

    // Validate props using Zod
    const validatedProps = actionButtonsSchema.parse({ activeAction, onActionClick });

    const [currentActive, setCurrentActive] = useState<ActionType>(validatedProps.activeAction);

    const handleActionClick = (action: ActionType) => {
        setCurrentActive(action);
        if (validatedProps.onActionClick) {
            validatedProps.onActionClick(action);
        }
    };

    const actionItems = [
        {
            id: 'clockIn' as ActionType,
            icon: <Login sx={{ fontSize: 18 }} />,
            label: 'Clock In'
        },
        {
            id: 'break' as ActionType,
            icon: <AccessTime sx={{ fontSize: 18 }} />,
            label: 'Break'
        },
        // {
        //     id: 'cancel' as ActionType,
        //     icon: <Cancel sx={{ fontSize: 18 }} />,
        //     label: 'Cancel'
        // },
        {
            id: 'homeOffice' as ActionType,
            icon: <Home sx={{ fontSize: 18 }} />,
            label: 'Home Office'
        },
        {
            id: 'businessTrip' as ActionType,
            icon: <Flight sx={{ fontSize: 18 }} />,
            label: 'Business Trip'
        },
        // {
        //     id: 'query' as ActionType,
        //     icon: <HelpOutline sx={{ fontSize: 18 }} />,
        //     label: 'Query'
        // },
    ];

 return (
     <Box
         sx={{
             display: 'grid',
             gridTemplateColumns: 'repeat(2, 1fr)',
             gap: '2rem',
             marginBottom: '1rem',
         }}
     >
         {actionItems.map((item) => {
             const isActive = currentActive === item.id;

             return (
                 <Box
                     key={item.id}
                     onClick={() => handleActionClick(item.id)}
                     sx={{
                         padding: '.5rem',
                         textAlign: 'center',
                         border: '2px solid',
                         borderColor: isActive ? '#e53e3e' : '#e2e8f0',
                         borderRadius: '8px',
                         cursor: 'pointer',
                         backgroundColor: isActive ? '#e53e3e' : 'white',
                         color: isActive ? 'white' : '#2d3748',
                         transition: 'all 0.3s ease',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '10px',
                         marginTop: '.25rem',
                         marginInline: '.75rem',
                         paddingTop: '.5rem',
                         '&:hover': {
                             borderColor: '#e53e3e',
                             backgroundColor: isActive ? '#e53e3e' : '#fef5f5',
                         },
                     }}
                 >
                     {/* Icon Container */}
                     <Box
                         sx={{
                             width: '40px',
                             height: '40px',
                             borderRadius: '50%',
                             backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             color: isActive ? 'white' : '#4a5568',
                         }}
                     >
                         {item.icon}
                     </Box>

                     {/* Label */}
                     <Typography
                         variant="body2"
                         sx={{
                             fontWeight: 500,
                             fontSize: '1rem',
                         }}
                     >
                         {item.label}
                     </Typography>
                 </Box>
             );
         })}
     </Box>
 );
};
