import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Stop } from '../types';

export const gtfsApi = createApi({
  reducerPath: 'gtfsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  tagTypes: ['Stops', 'Routes'], // Used for auto-refreshing
  endpoints: (builder) => ({
    // Auto-generates useGetStopsQuery hook
    getStops: builder.query<Stop[], void>({
      query: () => 'stops',
      providesTags: ['Stops'],
    }),
    // Auto-generates useAddStopMutation hook
    addStop: builder.mutation({
      query: (body) => ({
        url: 'stops',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stops'],
    }),
  }),
});

export const { useGetStopsQuery, useAddStopMutation } = gtfsApi;