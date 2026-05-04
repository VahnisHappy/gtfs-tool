import type { Point } from '../../types';
import PointPicker from '../atoms/PointPicker';

interface Props {
    pointA: Point | null;
    pointB: Point | null;
    mode: string;
    calculating: boolean;
    canCalculate: boolean;
    selectedPOICount: number;
    onPickA: () => void;
    onPickB: () => void;
    onCalculate: () => void;
}

export default function RoutePlannerForm({
    pointA,
    pointB,
    mode,
    calculating,
    canCalculate,
    selectedPOICount,
    onPickA,
    onPickB,
    onCalculate,
}: Props) {
    return (
        <>
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Set Route & Plan Stations
            </h4>

            <PointPicker label="A" point={pointA} activeColor="#c86bfa" isPicking={mode === 'pickA'} onPick={onPickA} />

            <PointPicker label="B" point={pointB} activeColor="#ffd500" isPicking={mode === 'pickB'} onPick={onPickB} />

            {/* Calculate Button */}
            <button
                onClick={onCalculate}
                disabled={!canCalculate}
                className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors mt-2 ${canCalculate
                    ? 'bg-[#00A8E8] text-white hover:bg-[#009AD6]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {calculating
                    ? 'Fetching route & optimizing...'
                    : `Plan Stations (${selectedPOICount} POI${selectedPOICount !== 1 ? 's' : ''})`}
            </button>
        </>
    );
}

