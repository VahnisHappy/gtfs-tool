import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { enterPolygonMode, closePolygon, clearPolygon } from '../../store/slices/appSlice';

export default function PolygonToolbar() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.appState.mode);
    const polygonVertices = useSelector((state: RootState) => state.appState.polygonVertices);
    const polygonClosed = useSelector((state: RootState) => state.appState.polygonClosed);

    const isPolygonMode = mode === 'polygon' || mode === 'pickA' || mode === 'pickB';
    const canClose = polygonVertices.length >= 3;

    return (
        <div className="relative">
            <button
                onClick={() => !isPolygonMode && dispatch(enterPolygonMode())}
                className={
                    `flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ` +
                    (isPolygonMode
                        ? 'bg-[#f0691a] border-[#f0691a] text-white cursor-default'
                        : 'bg-[#ff7a2f] border-gray-200 text-white hover:bg-[#f0691a]')
                }
                title="Draw polygon to find POIs"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" strokeLinejoin="round" />
                </svg>
                {isPolygonMode ? (polygonClosed ? 'closed' : 'drawing...') : 'find POI'}
            </button>

            {isPolygonMode && (
                <div className="absolute left-0 top-full mt-1 z-50 flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-md shadow-lg border border-gray-200 whitespace-nowrap">
                    <span className="text-xs text-gray-500 font-medium">
                        {polygonClosed ? 'polygon closed' : `${polygonVertices.length} pts`}
                    </span>

                    {!polygonClosed && (
                        <button
                            onClick={() => canClose && dispatch(closePolygon())}
                            disabled={!canClose}
                            className={
                                `px-2 py-0.5 text-xs text-white rounded transition-colors font-medium ` +
                                (canClose
                                    ? 'bg-[#ff7a2f] hover:bg-[#f0691a]'
                                    : 'bg-[#ff7a2f] opacity-40 cursor-not-allowed')
                            }
                        >
                            done
                        </button>
                    )}

                    <button
                        onClick={() => dispatch(clearPolygon())}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors font-medium"
                    >
                        clear
                    </button>
                </div>
            )}
        </div>
    );
}
