// src/redux/SessionApi/SessionApi.jsx

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SessionApi = createApi({
  reducerPath: "SessionApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8086/api",
  }),

  tagTypes: ["Session"],

  endpoints: (builder) => ({
    createSession: builder.mutation({
      query: (data) => ({
        url: "/sessions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Session"],
    }),

    getAllSessions: builder.query({
      query: () => "/sessions",
      providesTags: ["Session"],
    }),

    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
  useLazyGetAllSessionsQuery,
  useDeleteSessionMutation,
} = SessionApi;