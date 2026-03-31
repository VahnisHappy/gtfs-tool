import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { enterPolygonMode, closePolygon, clearPolygon } from '../../store/slices/appSlice';

export default function PolygonToolbar() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.appState.mode);
    const polygonVertices = useSelector((state: RootState) => state.appState.polygonVertices);
    const polygonClosed = useSelector((state: RootState) => state.appState.polygonClosed);

    const isPolygonMode = mode === 'polygon';
    const canClose = polygonVertices.length >= 3 && !polygonClosed;

    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
            {!isPolygonMode ? (
                <button
                    onClick={() => dispatch(enterPolygonMode())}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    title="Draw polygon to find POIs"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" strokeLinejoin="round" />
                    </svg>
                    Find POI
                </button>
            ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-gray-200">
                    <span className="text-sm font-medium text-[#00A8E8] mr-1">
                        {polygonClosed ? '✓ Polygon closed' : `Drawing (${polygonVertices.length} points)`}
                    </span>

                    {canClose && (
                        <button
                            onClick={() => dispatch(closePolygon())}
                            className="px-3 py-1 bg-[#00A8E8] text-white text-sm rounded-md hover:bg-[#009AD6] transition-colors font-medium"
                        >
                            Done
                        </button>
                    )}

                    <button
                        onClick={() => dispatch(clearPolygon())}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
