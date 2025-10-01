import { Box, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface ProtocolFiltersProps {
    onDateChange?: ( date: string ) => void;
    isRecordLoading: boolean;
}

export default function ProtocolFilters( { onDateChange, isRecordLoading }: ProtocolFiltersProps ) {
    const [ selectedDate, setSelectedDate ] = useState<Dayjs | null>(dayjs());
    const [ openCalendar, setOpenCalendar ] = useState<boolean>(false);

    const handleDateChange = ( newDate: Dayjs | null ) => {
        if ( newDate ) {
            setSelectedDate(newDate);
            const formattedDate = newDate.format("YYYY-MM-DD");

            if ( onDateChange ) {
                onDateChange(formattedDate);
            }
            // after selection, close calendar immediately
            setOpenCalendar(false);
        }
    };

    const handleCalendarClick = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
        if ( !isRecordLoading ) {
            setOpenCalendar(true);
        }
    }

    return (
        <Box
            sx={ {
                padding: '15px 20px',
                backgroundColor: '#f7fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'wrap',
            } }
        >
            {/* Filter Group - Date */ }
            <Box sx={ { display: 'flex', alignItems: 'center', gap: '10px' } }>
                <Typography
                    variant="body2"
                    sx={ {
                        fontWeight: 600,
                        color: '#4a5568',
                        minWidth: '80px',
                    } }
                >
                    Time Period:
                </Typography>
                <DatePicker
                    value={ selectedDate }
                    onChange={ handleDateChange }
                    onOpen={() => setOpenCalendar(true)}
                    onClose={() => setOpenCalendar(false)}
                    disabled={isRecordLoading}
                    slotProps={ {
                        textField: {
                            size: "small",
                            onClick: () => setOpenCalendar(true),
                            sx: {
                                backgroundColor: "white",
                                minWidth: 150,
                                cursor: isRecordLoading ? 'wait' : 'pointer',
                                '& .MuiOutlinedInput-root': {
                                    cursor: isRecordLoading ? 'wait' : 'pointer',
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#cbd5e0",
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#a0aec0',
                                },
                                // Disable pointer events during loading
                                pointerEvents: isRecordLoading ? 'none' : 'auto',
                                opacity: isRecordLoading ? 0.6 : 1,
                            },
                        },
                        popper: {
                            placement: 'bottom-start',
                        }
                    } }
                />
                {isRecordLoading && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#718096',
                            fontStyle: 'italic',
                            ml: 1,
                            mt: 2,
                        }}
                    >
                        Loading records...
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
