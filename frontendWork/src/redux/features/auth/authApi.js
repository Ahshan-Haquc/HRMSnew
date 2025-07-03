import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4001/api/auth",
    credentials: 'include'
  }),
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/register',
        method: "POST",
        body: newUser
      })
    }),

    activateUser: builder.mutation({
      query: (activateInfo) => ({
        url: "/activate-user",
        method: "POST",
        body: activateInfo
      })
    }),

    loginUser: builder.mutation({
      query: (loginInfo) => ({
        url: "/login",
        method: "POST",
        body: loginInfo
      })
    }),

    logouUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST"
      })
    }),

    searchUserByEmail: builder.query({
      query: (email) => ({
        url: `/finduserbyemail/${email}`,
        method: "GET"
      })
    }),

    forgetUserPassword: builder.mutation({
      query: (email) => ({
        url: '/forget-password',
        method: "POST",
        body: { email }
      })
    }),

    resetUserPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: '/reset-password',
        method: 'PATCH',
        body: { token, newPassword }
      })
    }),

    updateUserPassword: builder.mutation({
      query: ({ newPassword }) => ({
        url: '/update-password',
        method: 'PATCH',
        body: { newPassword }
      })
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useActivateUserMutation,
  useLoginUserMutation,
  useLogouUserMutation,
  useSearchUserByEmailQuery,
  useForgetUserPasswordMutation,
  useResetUserPasswordMutation,
  useUpdateUserPasswordMutation
} = authApi;

export default authApi;
