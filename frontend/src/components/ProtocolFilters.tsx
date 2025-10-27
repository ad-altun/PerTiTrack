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

    return (
        <Box
            sx={ {
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px',
                width: '100%',
                flexWrap: 'wrap',
                borderBottom: '2px solid', borderColor: 'border.main'
            } }
        >
            <Box sx={{
                color: 'text.primary',
                padding: '10px 20px',
            }} >
                <Typography
                    variant="h6" component="div"
                    sx={ {
                        fontWeight: 600,
                        color: 'text.secondary',
                    } }
                >
                    Booking List:
                </Typography>
            </Box>
            {/* Filter Group - Date */ }
            <Box sx={ {
                display: 'flex', alignItems: 'center', gap: '2rem',
            } }>
                <Typography
                    variant="body2"
                    sx={ {
                        fontWeight: 600,
                        color: 'text.secondary',
                    } }
                >
                    Time Period:
                </Typography>
                <DatePicker
                    value={ selectedDate }
                    onChange={ handleDateChange }
                    onOpen={ () => setOpenCalendar(true) }
                    onClose={ () => setOpenCalendar(false) }
                    disabled={ isRecordLoading }
                    maxDate={ dayjs() }
                    minDate={ dayjs().subtract(2, 'year') }
                    slotProps={ {
                        textField: {
                            size: "small",
                            onClick: () => setOpenCalendar(true),
                            sx: {
                                backgroundColor: "text.cardItem",
                                color: "text.secondary",
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
                {/*{ isRecordLoading && (*/}
                {/*    <Typography*/}
                {/*        variant="caption"*/}
                {/*        sx={ {*/}
                {/*            color: '#718096',*/}
                {/*            fontStyle: 'italic',*/}
                {/*            ml: 1,*/}
                {/*            mt: 2,*/}
                {/*        } }*/}
                {/*    >*/}
                {/*        Loading records...*/}
                {/*    </Typography>*/}
                {/*) }*/}
            </Box>
        </Box>
    );
};
