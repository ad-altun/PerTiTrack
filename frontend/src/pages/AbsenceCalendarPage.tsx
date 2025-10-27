import { useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Select, Paper, Typography, MenuItem, FormControl } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useCurrentEmployee } from "../hooks/useCurrentEmployee.ts";
import AbsenceTable from "../components/AbsenceTable.tsx";
import { getPublicHolidays } from "../service/publicHolidaysApi.ts";

export default function AbsenceCalendarPage() {
    const { employeeName } = useCurrentEmployee();

    const [ name, setName ] = useState<string | null>(employeeName);
    const [ year, setYear ] = useState<Dayjs | null>(dayjs());
    const [ publichHolidays, setPublichHolidays ] = useState<string[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const handleEmployeeChange = () => {
        // no functionality for an employee
        // only managers can check other employee's calendar
    };

    useEffect(() => {
        setName(employeeName);
    }, [ employeeName ]);

    const handleYearChange = ( newYear: Dayjs | null ) => {
        setYear(newYear);
    };

    useEffect(() => {
        const fetchData = async ( year: Dayjs | null ) => {
            setIsLoading(true);
            setError(null);
            try {
                const yearString = year ? year.format("YYYY") : dayjs().format("YYYY");
                const response = await getPublicHolidays(yearString);
                setPublichHolidays(response.map(item => item.date) || []);
            }
            catch (error) {
                setError('Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData(year);
    }, [ year ]);


    return (
        <Paper elevation={ 0 }
               sx={ {
                   display: 'flex',
                   flexDirection: 'column',
                   padding: '2rem',
                   marginBlock: '3rem',
               } }>
            <Box>
                <Typography variant="h3">
                    Absence Calendar
                </Typography>
            </Box>
            <Box sx={ {
                display: 'flex', gap: '1rem', mt: '1rem',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: { xs: 'flex-start', md: 'space-between' },
                flexDirection: { xs: 'column', md: 'row' },
                mb: '2.5rem',
            } }
            >
                <Box
                    sx={ {
                        display: 'flex', gap: '1rem',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' }
                    } }
                >
                    <Typography
                        variant="body2"
                        sx={ {
                            fontWeight: 600,
                            color: 'text.secondary',
                        } }
                    >
                        Employee:
                    </Typography>
                    <FormControl size="small"
                                 sx={ {
                                     minWidth: {xs: '10rem', sm: "15rem"},
                                     display: 'flex', gap: '1rem',
                                 } }
                    >
                        <Select
                            // labelId="employee-label"
                            id="employee-select"
                            value={ name || '' }
                            onChange={ () => handleEmployeeChange() }
                        >
                            <MenuItem value={ name || '' }>{ name }</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={ {
                    display: 'flex', gap: '1rem',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' }
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
                        onChange={ handleYearChange }
                        value={ year }
                        openTo="year"
                        views={ [ 'year' ] }
                        disabled={ isLoading }
                        maxDate={ dayjs() }
                        minDate={ dayjs().subtract(10, 'year') }
                        yearsPerRow={ 3 }
                        yearsOrder="desc"
                        slotProps={ {
                            textField: {
                                size: 'small',
                                sx: {
                                    maxWidth: '10rem',
                                },
                            },
                            popper: {
                                placement: 'bottom-end',
                                sx: {
                                    width: '20rem'
                                },
                            },
                            layout: {
                                sx: {
                                    '.MuiYearCalendar-root': {
                                        width: '20rem',
                                        height: '12rem',
                                        marginTop: '4rem',
                                    },
                                },
                            },
                        } }
                    />
                </Box>
            </Box>
            <AbsenceTable
                onYearChange={ publichHolidays }
                year={ year }
                isLoading={ isLoading }
            />
        </Paper>
    );
};
