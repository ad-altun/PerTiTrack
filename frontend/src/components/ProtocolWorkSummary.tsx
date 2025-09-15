import { Edit } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";


interface ProtocolWorkSummaryProps {
    id: string;
    workSummary: string;
}

export default function ProtocolWorkSummary({ id, workSummary }: ProtocolWorkSummaryProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(workSummary);
    const [currentSummary, setCurrentSummary] = useState(workSummary);

    const handleEditClick = () => {
        setEditValue(currentSummary);
        setIsEditing(true);
    };

    const handleSave = () => {
        setCurrentSummary(editValue);
        setIsEditing(false);
        console.log('Saving work summary for ID:', id, 'Value:', editValue);
        // Here you would typically make an API call to save the data
    };

    const handleCancel = () => {
        setEditValue(currentSummary);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Box sx={{ width: '100%' }}>
                <TextField
                    multiline
                    minRows={2}
                    maxRows={4}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    sx={{
                        width: '100%',
                        marginBottom: '8px',
                        '& .MuiOutlinedInput-root': {
                            fontSize: '13px',
                            '& fieldset': {
                                borderColor: '#cbd5e0',
                            },
                        },
                    }}
                />
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#48bb78',
                            color: 'white',
                            fontSize: '12px',
                            textTransform: 'none',
                            minWidth: 'auto',
                            padding: '4px 12px',
                            '&:hover': {
                                backgroundColor: '#38a169',
                            },
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCancel}
                        sx={{
                            color: '#a0aec0',
                            borderColor: '#a0aec0',
                            fontSize: '12px',
                            textTransform: 'none',
                            minWidth: 'auto',
                            padding: '4px 12px',
                            '&:hover': {
                                borderColor: '#718096',
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        );
    }

 return (
     <Box
         sx={{
             display: 'flex',
             alignItems: 'flex-start',
             gap: '8px',
             cursor: 'pointer',
         }}
         onClick={handleEditClick}
     >
         <Typography
             variant="body2"
             sx={{
                 color: '#4a5568',
                 fontSize: '13px',
                 lineHeight: 1.4,
                 flex: 1,
                 wordBreak: 'break-word',
             }}
         >
             {currentSummary}
         </Typography>
         <IconButton
             size="small"
             sx={{
                 padding: '2px',
                 color: '#a0aec0',
                 '&:hover': {
                     color: '#4a5568',
                     backgroundColor: '#f7fafc',
                 },
             }}
         >
             <Edit sx={{ fontSize: 14 }} />
         </IconButton>
     </Box>
 );
};
