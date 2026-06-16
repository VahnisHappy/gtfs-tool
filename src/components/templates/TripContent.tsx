import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { openTripDetail } from "../../store/slices/appSlice";
import EditDeleteButton from "../molecules/EditDeleteButton";
import ButtonAction from "../atoms/ButtonAction";
import TripContentDetail from "../organisms/TripContentDetail";
import TripCard from "../molecules/TripCard";
import { useDeleteTripMutation } from "../../services/gtfsApi";

export default function TripContent() {
    const trips = useSelector((state: RootState) => state.tripState.data);
    const routes = useSelector((state: RootState) => state.routeState.data);
    const calendars = useSelector((state: RootState) => state.calendarState.data);

    const dispatch = useDispatch();
    // const isTripDetailOpen = useSelector((state: RootState) => state.appState.isTripDetailOpen);
    const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
    const selectedTripDetail = useSelector((state: RootState) => state.appState.selectedTrip);
    const [deleteTrip] = useDeleteTripMutation();
    
    const handleNewTrip = () => {
        setSelectedTrip(null);
        dispatch(openTripDetail({ mode: 'new' }));
    }

    const handleSelectTrip = (index: number) => {
        const newSelection = selectedTrip === index ? null : index;
        setSelectedTrip(newSelection);
    }

    const handleEditTrip = () => {
        if (selectedTrip === null) return;
        const trip = trips[selectedTrip]
        dispatch(openTripDetail({
            mode: 'edit',
            ...trip,
            tripIndex: selectedTrip
        }))
    }

    const handleDeleteTrip = async () => {
        if (selectedTrip === null) return;
        
        const trip = trips[selectedTrip];
        if (window.confirm(`Are you sure you want to delete trip "${trip.id.value}"?`)) {
            try {
                await deleteTrip(trip.id.value).unwrap();
                setSelectedTrip(null);
            } catch (error) {
                console.error('Failed to delete trip:', error);
                alert('Failed to delete trip. Please try again.');
            }
        }
    }

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full">
                <div  className="flex items-center justify-end pb-2 border-b border-gray-300">
                    <ButtonAction label="new trip" onClick={handleNewTrip} />
                </div>

            <div className="flex-1 overflow-y-auto">
                <div className="py-2 flex justify-between">
                    <h3 className="font-semibold">trip list ({trips.length})</h3>
                    <EditDeleteButton onEdit={handleEditTrip} onDelete={handleDeleteTrip} disabled={selectedTrip === null} isEditing={selectedTripDetail?.mode === 'edit'} />
                </div>
                
                    {trips.length === 0 ? (
                        <p className="text-gray-500 text-sm px-4 py-4 text-center">no trips available. click "new trip" to create one.</p>
                    ) : (
                        <ul className="space-y-0">
                        {trips.map((trip, index) => {
                            const routeName = trip.route.value !== null ? routes[trip.route.value]?.id.value : undefined;
                            const calendarId = trip.calendar.value !== null ? calendars[trip.calendar.value]?.id.value : undefined;
                            
                            return (
                                <TripCard
                                    key={index}
                                    trip={trip}
                                    routeName={routeName}
                                    calendarId={calendarId}
                                    isSelected={selectedTrip === index}
                                    onSelect={() => handleSelectTrip(index)}
                                />
                            );
                        })}
                    </ul>
                    )} 
            </div>
            </div>
            <TripContentDetail />
        </div>
    )
}