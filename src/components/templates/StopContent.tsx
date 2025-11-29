import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../store";
import { openStopDetail } from "../../store/slices/appSlice";
import ButtonAction from "../atoms/ButtonAction";
import StopContentDetail from "../organisms/StopContentDetail";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    const isStopDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
    const dispatch = useDispatch();

    const handleNewStop = () => {
        // Open detail panel in 'new' mode, which also sets mode to 'mark'
        dispatch(openStopDetail({
            mode: 'new',
            lat: null,
            lng: null
        }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, [isStopDetailOpen]);

    return (
        <div className="flex h-full w-full">
            <div 
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
            >
                <div className="flex items-center p-4 border-b">
                    <ButtonAction label="New Stop" onClick={handleNewStop} />
                </div>
                <div className="p-4 border-b">
                    <h3 className="font-semibold mb-2">Stop List</h3>
                    <ul>
                        {stops.map((stop) => (
                            <li key={String(stop.id)}>{stop.name.value}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <StopContentDetail />
        </div>
    );
}