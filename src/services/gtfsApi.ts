import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Stop, Trip } from '../types';
import { getToken } from './authService';
import type { RootState } from '../store';

export const gtfsApi = createApi({
  reducerPath: 'gtfsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers, { getState }) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      const state = getState() as RootState;
      const agencyId = state.agencyState.activeAgencyId;
      if (agencyId) {
        headers.set('x-agency-id', agencyId);
      }
      return headers;
    },
  }),
  tagTypes: ['Stops', 'Routes', 'Trips'], // Used for auto-refreshing
  endpoints: (builder) => ({
    // Auto-generates useGetStopsQuery hook
    getStops: builder.query<Stop[], string>({
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
    getTrips: builder.query<Trip[], string>({
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