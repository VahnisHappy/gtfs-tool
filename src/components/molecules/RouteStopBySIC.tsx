import type { Point } from '../../types';
import PointPicker from '../atoms/PointPicker';

interface Props {
    pointA: Point | null;
    pointB: Point | null;
    mode: string;
    calculating: boolean;
    canCalculate: boolean;
    selectedPOICount: number;
    customStationCount: number | null;
    onPickA: () => void;
    onPickB: () => void;
    onCalculate: () => void;
    onStationCountChange: (count: number | null) => void;
}

export default function RouteStopBySIC({
    pointA,
    pointB,
    mode,
    calculating,
    canCalculate,
    selectedPOICount,
    customStationCount,
    onPickA,
    onPickB,
    onCalculate,
    onStationCountChange,
}: Props) {
    return (
        <>
            <h4> Set Route & Plan Stations</h4>
 
            <PointPicker label="A" point={pointA} activeColor="#c86bfa" isPicking={mode === 'pickA'} onPick={onPickA} />

            <PointPicker label="B" point={pointB} activeColor="#ffd500" isPicking={mode === 'pickB'} onPick={onPickB} />

            <div className="mt-3 mb-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    number of stations <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        max={30}
                        value={customStationCount ?? ''}
                        placeholder="number of stations"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                onStationCountChange(null);
                            } else {
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num >= 1) {
                                    onStationCountChange(Math.min(num, 30));
                                }
                            }
                        }}
                        className="flex-1 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md bg-white transition-colors"
                    />
                    {customStationCount !== null && (
                        <button
                            type="button"
                            onClick={() => onStationCountChange(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
                        >
                            reset to auto
                        </button>
                    )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                    {customStationCount !== null
                        ? `will place exactly ${customStationCount} station${customStationCount !== 1 ? 's' : ''}`
                        : 'auto-detected via SIC analysis'}
                </p>
            </div>

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
                    ? 'fetching route & optimizing...'
                    : `plan stations (${selectedPOICount} POI${selectedPOICount !== 1 ? 's' : ''})`}
            </button>
        </>
    );
}
