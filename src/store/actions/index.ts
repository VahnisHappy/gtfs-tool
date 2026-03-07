import stopSlice from "../slices/stopSlice";
import appSlice from "../slices/appSlice";
import routeSlice from "../slices/routeSlice";
import mapSlice from "../slices/mapSlice";
import calendarSlice from "../slices/calendarSlice";
import tripSlice from "../slices/tripSlice";
import agencySlice from "../slices/agencySlice";

export const StopActions = stopSlice.actions;
export const AppActions = appSlice.actions;
export const RouteActions = routeSlice.actions;
export const CalendarActions = calendarSlice.actions;
export const MapActions = mapSlice.actions;
export const TripAction = tripSlice.actions;
export const AgencyActions = agencySlice.actions;