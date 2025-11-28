import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { openStopDetail } from "../../store/slices/appSlice";
import ButtonAction from "../atoms/ButtonAction";
import StopContentDetail from "../organisms/StopContentDetail";
import { useEffect } from "react";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    const dispatch = useDispatch();

    const handleNewStop = () => {
        dispatch(openStopDetail({
            mode: 'new'
        }));
    }

    return (
        <div>
            <div className="flex items-center">
                <ButtonAction label="New Stop" onClick={handleNewStop} />
            </div>
            <div className="mt-4">
                stop list
            </div>
            
            {/* Always render, component handles its own visibility */}
            <StopContentDetail />
        </div>
    );
}