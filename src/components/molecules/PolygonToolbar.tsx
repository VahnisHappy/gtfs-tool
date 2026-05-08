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
        <div className="flex items-center gap-2 ">
            {!isPolygonMode ? (
                <button
                    onClick={() => dispatch(enterPolygonMode())}
                    className="flex items-center gap-2 px-4 py-1.75 bg-[#ff7a2f] rounded-md  border border-gray-200 hover:bg-[#f0691a] transition-colors text-sm font-medium text-white"
                    title="Draw polygon to find POIs"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" strokeLinejoin="round" />
                    </svg>
                    find POI
                </button>
            ) : (
                <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-sm shadow-md border border-gray-200">
                    <span className="text-sm font-medium mr-1 leading-tight">
                        {polygonClosed ? (
                            ' polygon closed'
                        ) : (
                            <>
                                <span className="block">drawing</span>
                                <span className="block">({polygonVertices.length} points)</span>
                            </>
                        )}
                    </span>


                    {!polygonClosed && (
                        <button
                            onClick={() => canClose && dispatch(closePolygon())}
                            disabled={!canClose}
                            aria-disabled={!canClose}
                            className={
                                `px-3 py-1 text-white text-sm rounded-md transition-colors font-medium ` +
                                (canClose
                                    ? 'bg-[#ff7a2f] hover:bg-[#f0691a]'
                                    : 'bg-[#ff7a2f] opacity-50 cursor-not-allowed')
                            }
                        >
                            done
                        </button>
                    )}

                    <button
                        onClick={() => dispatch(clearPolygon())}
                        className="px-3 py-1 bg-[#00bfa5] text-white text-sm rounded-sm hover:bg-[#099481] transition-colors font-medium "
                    >
                        clear
                    </button>
                </div>
            )}
        </div>
    );
}
