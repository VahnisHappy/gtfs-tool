import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { StopActions, AppActions } from "../../store/actions";
import StopMarker from "../atoms/StopMarker";

export type StopDisplayProps = {
    onClick?: (index: number) => void;
}

export default function StopDisplay({ onClick }: StopDisplayProps) {
    const dispatch = useDispatch();
    const stops = useSelector((state: RootState) => state.stopState.data);
    const selectedIndex = useSelector((state: RootState) => state.stopState.selectedIndex);
    const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
    const isStopDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);

    // Determine which stop is being edited (has detail panel open)
    const editingStopIndex = isStopDetailOpen && selectedStop?.stopIndex !== undefined
        ? selectedStop.stopIndex
        : null;

    const handleDragEnd = (index: number, lat: number, lng: number) => {
        // Update stop coordinates in the stop state
        dispatch(StopActions.setCoordinates({ index, lat, lng }));
        // Also update the appState so StopContentDetail form fields sync
        dispatch(AppActions.updateStopCoordinates({ lat, lng, stopIndex: index }));
    };

    return <>
        {stops.map((stop, index) => (
            <StopMarker
                key={index}
                stop={stop}
                isSelected={selectedIndex === index}
                isDraggable={editingStopIndex === index}
                onClick={() => onClick?.(index)}
                onDragEnd={(lat, lng) => handleDragEnd(index, lat, lng)}
            />
        ))}
    </>
}