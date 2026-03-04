import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Stop, Trip } from '../types';

export const gtfsApi = createApi({
  reducerPath: 'gtfsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  tagTypes: ['Stops', 'Routes', 'Trips'], // Used for auto-refreshing
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
    // Trip endpoints
    getTrips: builder.query<Trip[], void>({
      query: () => 'trips',
      providesTags: ['Trips'],
    }),
    addTrip: builder.mutation<Trip, any>({
      query: (body) => ({
        url: 'trips',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Trips'],
    }),
    updateTrip: builder.mutation<Trip, { id: string } & any>({
      query: ({ id, ...body }) => ({
        url: `trips/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Trips'],
    }),
    deleteTrip: builder.mutation<void, string>({
      query: (id) => ({
        url: `trips/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trips'],
    }),
  }),
});

export const { 
  useGetStopsQuery, 
  useAddStopMutation, 
  useGetTripsQuery, 
  useAddTripMutation, 
  useUpdateTripMutation, 
  useDeleteTripMutation 
} = gtfsApi;