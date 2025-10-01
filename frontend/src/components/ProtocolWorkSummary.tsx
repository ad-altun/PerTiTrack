import { Box, Button, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
    Snackbar,
    Alert
} from '@mui/material';
import { useUpdateTimeRecordNotesMutation } from "../store/api/timetrackApi.ts";

interface ProtocolWorkSummaryProps {
    id: string;
    workSummary: string | null;
    isNewRecord?: boolean;
    onNotesUpdate?: () => void;
}

export default function ProtocolWorkSummary( {
    id,
    workSummary,
    isNewRecord = false,
    onNotesUpdate,
}: ProtocolWorkSummaryProps ) {

    const [ isEditing, setIsEditing ] = useState(isNewRecord);
    const [ notes, setNotes ] = useState(workSummary || '');
    const [ showSuccess, setShowSuccess ] = useState(false);

    const [ updateNotes, { isLoading, error } ] = useUpdateTimeRecordNotesMutation();

    // Auto-enable editing for new records
    useEffect(() => {
        if ( isNewRecord ) {
            setIsEditing(true);
            setNotes(''); // Start with empty notes for new records
        }
    }, [ isNewRecord ]);

    const handleEdit = () => {
        setIsEditing(true);
        setNotes(workSummary || '');
    };

    const handleSave = async () => {
        try {
            await updateNotes({ id, notes }).unwrap();
            setIsEditing(false);
            setShowSuccess(true);

            // Notify parent component
            if ( onNotesUpdate ) {
                onNotesUpdate();
            }

            // Dispatch custom event to trigger table refresh
            window.dispatchEvent(new CustomEvent('timeRecordUpdated'));
        }
        catch (err) {
            console.error('Failed to update notes:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNotes(workSummary || '');
    };

    const handleKeyPress = ( event: React.KeyboardEvent ) => {
        if ( event.key === 'Enter' && ( event.ctrlKey || event.metaKey ) ) {
            handleSave().then();
        } else if ( event.key === 'Escape' ) {
            handleCancel();
        }
    };


    if ( isEditing ) {
        return (
            <>
                <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
                    <TextField
                        multiline
                        rows={ 3 }
                        value={ notes }
                        onChange={ ( e ) => setNotes(e.target.value) }
                        onKeyDown={ handleKeyPress }
                        placeholder={ isNewRecord ? "Add work summary..." : "Edit work summary..." }
                        variant="outlined"
                        size="small"
                        autoFocus={ isNewRecord }
                        sx={ {
                            '& .MuiOutlinedInput-root': {
                                fontSize: '13px',
                            }
                        } }
                        disabled={ isLoading }
                    />

                    <Box sx={ { display: 'flex', gap: 1, justifyContent: 'flex-end' } }>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={ <SaveIcon/> }
                            onClick={ handleSave }
                            disabled={ isLoading }
                            sx={ { fontSize: '11px', height: '28px' } }
                        >
                            Save
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={ <CancelIcon/> }
                            onClick={ handleCancel }
                            disabled={ isLoading }
                            sx={ { fontSize: '11px', height: '28px' } }
                        >
                            Cancel
                        </Button>
                    </Box>

                    { error && (
                        <Typography variant="caption" color="error">
                            Failed to save notes. Please try again.
                        </Typography>
                    ) }
                </Box>

                <Snackbar
                    open={ showSuccess }
                    autoHideDuration={ 3000 }
                    onClose={ () => setShowSuccess(false) }
                    anchorOrigin={ { vertical: 'bottom', horizontal: 'center' } }
                >
                    <Alert severity="success" onClose={ () => setShowSuccess(false) }>
                        Work summary updated successfully!
                    </Alert>
                </Snackbar>
            </>
        );
    }

    return (
        <Box sx={ { display: 'flex', alignItems: 'flex-start', gap: 1 } }>
            <Typography
                variant="body2"
                sx={ {
                    color: '#4a5568',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    flex: 1,
                    minHeight: '20px',
                    fontStyle: workSummary ? 'normal' : 'italic',
                    opacity: workSummary ? 1 : 0.6
                } }
            >
                { workSummary || 'No work summary' }
            </Typography>

            <IconButton
                size="small"
                onClick={ handleEdit }
                sx={ {
                    padding: '2px',
                    opacity: 0.7,
                    '&:hover': {
                        opacity: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                } }
            >
                <EditIcon sx={ { fontSize: '16px' } }/>
            </IconButton>
        </Box>
    );
};
