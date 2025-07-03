import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const employeeApi = createApi({
    reducerPath: "employeeApi", // ✅ this must be a string
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4001/api/employee",
        credentials: 'include'
    }),

    endpoints: (builder) => ({
        addEmployee: builder.mutation({
            query: (employeeData) => ({
                url: "/add",
                method: "POST",
                body: employeeData
            }),
        })
    })
});


export const {
  useAddEmployeeMutation
} = employeeApi;

export default employeeApi;