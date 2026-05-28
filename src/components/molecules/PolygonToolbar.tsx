import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { enterPolygonMode, closePolygon, clearPolygon } from '../../store/slices/appSlice';
import { createPortal } from 'react-dom';

/**
 * The "find POI" button lives inline in the sidebar (never changes size).
 * When polygon mode is active, controls float over the map via a portal so
 * they don't shift any sidebar elements.
 */
export default function PolygonToolbar() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.appState.mode);
    const polygonVertices = useSelector((state: RootState) => state.appState.polygonVertices);
    const polygonClosed = useSelector((state: RootState) => state.appState.polygonClosed);

    const isPolygonMode = mode === 'polygon' || mode === 'pickA' || mode === 'pickB';
    const canClose = polygonVertices.length >= 3;

    return (
        <>
            {/* Inline button — always the same size, never moves anything */}
            <button
                onClick={() => dispatch(enterPolygonMode())}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#ff7a2f] rounded-md border border-gray-200 hover:bg-[#f0691a] transition-colors text-sm font-medium text-white"
                title="Draw polygon to find POIs"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" strokeLinejoin="round" />
                </svg>
                find POI
            </button>

            {/* Floating controls — rendered via portal so they never push sidebar content */}
            {isPolygonMode && createPortal(
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-xl border border-gray-200">
                    <svg className="w-4 h-4 text-[#ff7a2f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                        {polygonClosed
                            ? 'polygon closed'
                            : `drawing · ${polygonVertices.length} point${polygonVertices.length !== 1 ? 's' : ''}`}
                    </span>

                    {!polygonClosed && (
                        <button
                            onClick={() => canClose && dispatch(closePolygon())}
                            disabled={!canClose}
                            className={
                                `px-3 py-1 text-white text-sm rounded-md font-medium transition-colors ` +
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
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                        cancel
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}
