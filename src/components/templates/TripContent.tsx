import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { openTripDetail } from "../../store/slices/appSlice";
import EditDeleteButton from "../molecules/EditDeleteButton";
import ButtonAction from "../atoms/ButtonAction";
import TripContentDetail from "../organisms/TripContentDetail";

export default function TripContent() {
    const trips = useSelector((state: RootState) => state.tripState.data);

    const dispatch = useDispatch();
    const isTripDetailOpen = useSelector((state: RootState) => state.appState.isTripDetailOpen);
    const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
    
    const handleNewTrip = () => {
        setSelectedTrip(null);
        dispatch(openTripDetail({ mode: 'new' }));  
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

    const handleDeleteTrip = () => {
        if (selectedTrip === null) return;
        
        const trip = trips[selectedTrip];
        if (window.confirm(`Are you sure you want to delete this trip?`)) {
            setSelectedTrip(null);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, [isTripDetailOpen]);

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full">
                <div  className="flex items-center gap-2 justify-between pb-2 border-b">
                    <EditDeleteButton
                        onEdit={handleEditTrip}
                        onDelete={handleDeleteTrip}
                        disabled={selectedTrip === null}
                    />
                    <ButtonAction label="new trip" onClick={handleNewTrip} />
                </div>
            <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                        <h3 className="font-semibold mb-2">trip list ({trips.length})</h3>
                </div>

            </div>
            </div>
            <TripContentDetail />
        </div>
    )
}