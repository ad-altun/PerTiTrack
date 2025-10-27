import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import '../styles/AbsenceTable.css'
import dayjs, { type Dayjs } from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";

interface AbsenceTableProps {
    onYearChange: string[];
    year: Dayjs | null;
    isLoading: boolean;
}

export default function AbsenceTable( { onYearChange, year, isLoading }: AbsenceTableProps ) {

    // numbers from 1 to 31
    const columns = Array.from({ length: 31 }, ( _, index ) => index + 1);
    const monthsToDisplay = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December' ];

    // add '0's to 1...9 in the columns array
    const formattedColumns = columns.map(col => col.toString().padStart(2, '0'));

    return (
            <Paper elevation={2}
                   sx={{ overflowX: 'auto' }}
            >
                <Box>
                    <table className="absence-table-container">
                        <thead className="table-header">
                        {/* first-row: year plus day 1 to day 31 */}
                        <tr>
                            {/* year */}
                            <th scope="col">{ year?.year() }</th>
                            {/* loop with each day (1 to 31) */}
                            { columns.map(( item, index ) => (
                                // day 1 to 31
                                <th key={ index } scope="col">{ item }</th>
                            )) }
                        </tr>
                        </thead>
                        <tbody>
                        {   // fill the table - loop with each month
                            monthsToDisplay.map(( month, index ) => (
                            //  table-row for the looped month
                            <tr key={ index } className="month-row">
                                {/* pass the current month */}
                                <th scope="row">{ month }</th>
                                {/* fill 31 cells for that month */}
                                { formattedColumns.map(( col, index ) => {
                                    // ---------- Public Holiday helpers -------------
                                    const monthIndex = monthsToDisplay.indexOf(month);
                                    // add '0's to the month index where it is a value from 1 to 9
                                    const monthPadded = (monthIndex + 1).toString().padStart(2, '0');
                                    // format: YYYY-MM-DD
                                    const dateToCheck = `${year?.year()}-${monthPadded}-${col}`;

                                    // ------------- weekends -------------
                                    const isWeekend = (yearNum: number, monthPadded: string, dayPadded: string): boolean => {
                                        const date = dayjs(`${yearNum}-${monthPadded}-${dayPadded}`, 'YYYY-MM-DD');
                                        const dayOfWeek = date.day();
                                        return dayOfWeek === 0 || dayOfWeek === 6;
                                    };

                                    return (
                                        <td key={index}>
                                            {isLoading ? (
                                                <Skeleton variant="text" width="100%" height={30}/>
                                            ) : (
                                                <>
                                                    { isWeekend(year!.year(), monthPadded, col) ?
                                                        (<Tooltip title="Weekend">
                                                            <span className="weekend tooltip">—</span>
                                                        </Tooltip>) :
                                                        onYearChange.includes(dateToCheck) ?
                                                            (<Tooltip title="Public Holiday" >
                                                                <span className="absence-badge absence-holiday" >PH</span>
                                                            </Tooltip>) :
                                                            <span className="no-absence" >—</span>
                                                    }
                                                </>
                                            )}
                                        </td>
                                    );
                                }) }
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </Box>
            </Paper>
    );
};
