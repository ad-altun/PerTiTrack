import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.ts";


export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux state
            const token = ( getState() as RootState ).auth?.token;

            if ( token ) {
                headers.set('authorization', `Bearer ${ token }`);
            }

            headers.set('content-type', 'application/json');
            return headers;
        }
    }),
    tagTypes: [
        'User',
        'Auth',
        'Employee',
        'TimeRecord',
        'WorkSchedule',
        'Absence',
        'AbsenceType',
        'Dashboard',
        'EmployeeDashboard',
        'ManagerDashboard',
        'MyTimeRecord',
        'MyAbsence',
        'PendingApproval',],
    endpoints: () => ({}), // extended with injectEndpoints
});
