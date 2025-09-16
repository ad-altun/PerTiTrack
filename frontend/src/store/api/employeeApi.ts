import { baseApi } from "./baseApi.ts";
import {
    type CreateEmployeeRequest, createEmployeeSchema,
    type Employee,
    employeeListSchema,
    employeeSchema, type UpdateEmployeeRequest, updateEmployeeSchema
} from "../../validation/employeeSchemas.ts";


export const employeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get all employees
        getAllEmployees: builder.query<Employee[], void>({
            query: () => ({
                url: '/employees',
                method: 'GET',
            }),
            transformResponse: (response: unknown) => {
                return employeeListSchema.parse(response);
            },
            providesTags: ['Employee'],
        }),

        // get employee by id
        getEmployeeById: builder.query<Employee, string>({
            query: (id) => ({
                url: `/employees/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: unknown) => {
                return employeeSchema.parse(response);
            },
            providesTags: (result, error, id) => [{
                type: 'Employee', id
            }],
        }),

        // create new employee
        createEmployee: builder.mutation<Employee, CreateEmployeeRequest>({
            query: (employeeData) => {
                const validateData = createEmployeeSchema.parse(employeeData);
                return {
                    url: '/employees',
                    method: 'POST',
                    body: validateData,
                };
            },
            transformResponse: (response: unknown) => {
                return employeeSchema.parse(response);
            },
            invalidatesTags: ['Employee'],
        }),

        // update an employee
        updateEmployee: builder.mutation<Employee, { id: string; employeeData: UpdateEmployeeRequest }>({
            query: ({ id, employeeData }) => {
                const validatedData = updateEmployeeSchema.parse(employeeData);
                return {
                    url: `/employees/${id}`,
                    method: 'PUT',
                    body: validatedData,
                };
            },
            transformResponse: (response: unknown) => {
                return employeeSchema.parse(response);
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Employee', id },
                'Employee',
            ],
        }),

        // Delete employee
        deleteEmployee: builder.mutation<void, string>({
            query: (id) => ({
                url: `/employees/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employee'],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetAllEmployeesQuery,
    useGetEmployeeByIdQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApi;