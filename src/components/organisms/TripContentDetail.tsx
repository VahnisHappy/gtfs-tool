import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { closeTripDetail } from "../../store/slices/appSlice";
import tripSlice from "../../store/slices/tripSlice";
import { useEffect } from "react";
import TextInput from "../atoms/TextInput";
import FormSelectInput from "../molecules/FormSelectInput";
import CancelSaveButton from "../molecules/CancelSaveButton";
import TripStopSequence from "../molecules/TripStopSequence";
import TripOptional from "../molecules/TripOptional";
import { useForm, Controller, FormProvider } from "react-hook-form";
import type { Trip, StopTime, Time } from "../../types";
import { useAddTripMutation, useUpdateTripMutation } from "../../services/gtfsApi";

interface StopTimeData {
    arrivalTime: string;
    departureTime: string;
}

interface StopSequenceItem {
    stopIndex: number;
    stopId: string;
    stopName: string;
    stopTime?: StopTimeData;
}

interface TripFormData {
    routeIndex: number;
    calendarIndex: number;
    tripId: string;
    tripName: string;
    stopSequence: StopSequenceItem[];
    headsign: string;
    shortName: string;
    direction: string;
    blockId: string;
    wheelchairAccessible: string;
    bikesAllowed: string;
}

export default function TripContentDetail() {
    const isOpen = useSelector((state: RootState) => state.appState.isTripDetailOpen);
    const selectedTrip = useSelector((state: RootState) => state.appState.selectedTrip);
    const dispatch = useDispatch();
    const [addTrip] = useAddTripMutation();
    const [updateTrip] = useUpdateTripMutation();

    const routes = useSelector((state: RootState) => state.routeState.data);
    const calendars = useSelector((state: RootState) => state.calendarState.data);
    const stops = useSelector((state: RootState) => state.stopState?.data || []);
    
    const isEditMode = selectedTrip?.mode === 'edit';
    
    const routes_map = new Map(routes.map((route, index) => [index, route.id.value || "<no id>"]));
    const calendars_map = new Map(calendars.map((calendar, index) => [index, calendar.id.value || "<no id>"]));

    const methods = useForm<TripFormData>({
        defaultValues: {
            routeIndex: -1,
            calendarIndex: -1,
            tripId: '',
            tripName: '',
            stopSequence: [],
            headsign: '',
            shortName: '',
            direction: '',
            blockId: '',
            wheelchairAccessible: '',
            bikesAllowed: ''
        }
    });

    const { control, handleSubmit, watch, setValue, reset } = methods;

    // Watch form values
    const routeIndex = watch('routeIndex');

    // Auto-populate stop sequence when route is selected (only for new trips, not edit mode)
    useEffect(() => {
        // Skip if in edit mode - the edit mode useEffect handles populating stop sequence
        if (isEditMode) return;
        
        if (routeIndex >= 0 && routes[routeIndex]) {
            const route = routes[routeIndex];
            const sequence = route.stopIndexes.map(stopIdx => {
                const stop = stops[stopIdx];
                return {
                    stopIndex: stopIdx,
                    stopId: stop?.id.value || '',
                    stopName: stop?.name.value || ''
                };
            }).filter(item => item.stopId);
            
            setValue('stopSequence', sequence);
        } else {
            setValue('stopSequence', []);
        }
    }, [routeIndex, routes, stops, setValue, isEditMode]);

    // Reset form when panel closes
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    // Helper to format Time object to HH:MM:SS string
    const formatTime = (time: Time | null | undefined): string => {
        if (!time) return '';
        const h = String(time.hour).padStart(2, '0');
        const m = String(time.minute).padStart(2, '0');
        const s = String(time.second || 0).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // Populate form with selected trip data when in edit mode
    useEffect(() => {
        if (isOpen && isEditMode && selectedTrip) {
            // Set basic fields from Trip type
            setValue('tripId', selectedTrip.id?.value || '');
            setValue('tripName', selectedTrip.id?.value || ''); // Use trip ID as name since tripName doesn't exist
            setValue('routeIndex', selectedTrip.route?.value ?? -1);
            setValue('calendarIndex', selectedTrip.calendar?.value ?? -1);
            
            // Optional fields are not stored in Trip type, so we leave them empty for edit
            // They would need to be fetched from the backend if we want to populate them

            // Build stop sequence from trip's stopTimes
            if (selectedTrip.stopTimes && selectedTrip.stopTimes.length > 0) {
                const sequence: StopSequenceItem[] = selectedTrip.stopTimes.map((st: StopTime) => {
                    // Try to get stop by index first, then by stopId if available
                    let stop = st.stopIndex >= 0 ? stops[st.stopIndex] : undefined;
                    let resolvedStopIndex = st.stopIndex;
                    
                    // If stop not found by index but we have stopId, find it
                    if (!stop && st.stopId) {
                        const foundIndex = stops.findIndex(s => s.id.value === st.stopId);
                        if (foundIndex >= 0) {
                            stop = stops[foundIndex];
                            resolvedStopIndex = foundIndex;
                        }
                    }
                    
                    return {
                        stopIndex: resolvedStopIndex,
                        stopId: stop?.id.value || st.stopId || '',
                        stopName: stop?.name.value || '',
                        stopTime: {
                            arrivalTime: formatTime(st.arrivalTime?.value),
                            departureTime: formatTime(st.departureTime?.value)
                        }
                    };
                });
                setValue('stopSequence', sequence);
            }
        }
    }, [isOpen, isEditMode, selectedTrip, stops, setValue]);

    const handleClose = () => {
        dispatch(closeTripDetail());
    };

    // Parse time string (HH:MM:SS) to Time object
    const parseTimeString = (timeStr: string): Time | null => {
        if (!timeStr) return null;
        const parts = timeStr.split(':').map(Number);
        if (parts.length < 2) return null;
        return {
            hour: parts[0] || 0,
            minute: parts[1] || 0,
            second: parts[2] || 0
        };
    };

    const onSubmit = async (data: TripFormData) => {
        try {
            // Validate required fields
            if (!data.tripId.trim()) {
                alert('Trip ID is required');
                return;
            }
            if (data.routeIndex < 0) {
                alert('Route selection is required');
                return;
            }
            if (data.calendarIndex < 0) {
                alert('Service selection is required');
                return;
            }

            // Convert to API format
            const apiData = {
                trip_id: data.tripId.trim(),
                route_id: routes[data.routeIndex]?.id.value,
                service_id: calendars[data.calendarIndex]?.id.value,
                trip_headsign: data.headsign?.trim() || undefined,
                trip_short_name: data.shortName?.trim() || undefined,
                direction_id: data.direction ? parseInt(data.direction) : undefined,
                block_id: data.blockId?.trim() || undefined,
                wheelchair_accessible: data.wheelchairAccessible ? parseInt(data.wheelchairAccessible) : undefined,
                bikes_allowed: data.bikesAllowed ? parseInt(data.bikesAllowed) : undefined,
                stop_times: data.stopSequence
                    .filter(s => s.stopId && (s.stopTime?.arrivalTime || s.stopTime?.departureTime))
                    .map((s, index) => ({
                        stop_sequence: index + 1,
                        stop_id: s.stopId,
                        arrival_time: s.stopTime?.arrivalTime || s.stopTime?.departureTime || '00:00:00',
                        departure_time: s.stopTime?.departureTime || s.stopTime?.arrivalTime || '00:00:00'
                    }))
            };

            // Validate that we have stop times
            if (apiData.stop_times.length === 0) {
                alert('At least one stop with time is required');
                return;
            }

            console.log('Sending trip data to API:', apiData);

            // Save to database via API (create or update based on mode)
            let result;
            if (isEditMode && selectedTrip?.id?.value) {
                result = await updateTrip({ id: selectedTrip.id.value, ...apiData }).unwrap();
                console.log('Trip updated successfully:', result);
                
                // Update in Redux store
                const tripIndex = selectedTrip.tripIndex;
                if (tripIndex !== undefined) {
                    const stopTimesData: StopTime[] = data.stopSequence.map((s) => ({
                        arrivalTime: { value: parseTimeString(s.stopTime?.arrivalTime || '') },
                        departureTime: { value: parseTimeString(s.stopTime?.departureTime || '') },
                        stopIndex: s.stopIndex
                    }));
                    const tripData: Trip = {
                        id: { value: data.tripId },
                        route: { value: data.routeIndex >= 0 ? data.routeIndex : null },
                        calendar: { value: data.calendarIndex >= 0 ? data.calendarIndex : null },
                        stopTimes: stopTimesData
                    };
                    dispatch(tripSlice.actions.updateTrip({ index: tripIndex, trip: tripData }));
                }
            } else {
                result = await addTrip(apiData).unwrap();
                console.log('Trip saved successfully:', result);
                
                // Convert API response to local format for Redux
                const stopTimesData: StopTime[] = data.stopSequence.map((s) => ({
                    arrivalTime: { value: parseTimeString(s.stopTime?.arrivalTime || '') },
                    departureTime: { value: parseTimeString(s.stopTime?.departureTime || '') },
                    stopIndex: s.stopIndex
                }));

                const tripData: Trip = {
                    id: { value: data.tripId },
                    route: { value: data.routeIndex >= 0 ? data.routeIndex : null },
                    calendar: { value: data.calendarIndex >= 0 ? data.calendarIndex : null },
                    stopTimes: stopTimesData
                };
                
                // Add to Redux store
                dispatch(tripSlice.actions.addTrip(tripData));
            }
            
            dispatch(closeTripDetail());
        } catch (error: any) {
            console.error('Failed to save trip:', error);
            
            // Show more specific error message
            const errorMessage = error?.data?.message || error?.message || 'Failed to save trip. Please try again.';
            alert(`Error saving trip: ${errorMessage}`);
        }
    };

    return (
        <aside
            className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {isEditMode ? (watch('tripId') || 'Edit Trip') : (watch('tripName') || 'New Trip')}
                    </h3>
                    <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Route ID and Service ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelectInput
                            name="routeIndex"
                            label="route id"
                            options={Array.from(routes_map.entries()).map(([index, id]) => ({
                                value: index,
                                label: id
                            }))}
                            placeholder="select route"
                        />
                        <FormSelectInput
                            name="calendarIndex"
                            label="service id"
                            options={Array.from(calendars_map.entries()).map(([index, id]) => ({
                                value: index,
                                label: id
                            }))}
                            placeholder="select"
                        />
                    </div>

                    {/* Trip ID and Trip Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="tripId"
                            control={control}
                            render={({ field }) => (
                                <TextInput label="trip id" value={field.value} onChange={field.onChange} placeholder="trip id"
                                />
                            )}
                        />
                        <Controller
                            name="tripName"
                            control={control}
                            render={({ field }) => (
                                <TextInput label="trip name" value={field.value} onChange={field.onChange} placeholder="trip name"
                                />
                            )}
                        />
                    </div>

                    {/* Stop Sequence */}
                    <TripStopSequence />

                    {/* Optional Fields */}
                    <TripOptional />
                </div>

                <CancelSaveButton onCancel={handleClose} onSave={handleSubmit(onSubmit)} />
            </form>
            </FormProvider>
        </aside>
    );
}
