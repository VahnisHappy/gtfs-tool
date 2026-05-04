import type { Point } from '../../types';

interface Props {
    label: string;
    point: Point | null;
    activeColor: string;
    isPicking: boolean;
    onPick: () => void;
}

export default function PointPicker({ label, point, activeColor, isPicking, onPick }: Props) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${point ? `bg-${activeColor}` : 'bg-gray-300'}`}
                style={point ? { backgroundColor: activeColor } : {}}
            >
                {label}
            </div>
            <div className="flex-1 min-w-0">
                {point ? (
                    <p className="text-sm text-gray-700 truncate">
                        {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                    </p>
                ) : (
                    <p className="text-sm text-gray-400">not set</p>
                )}
            </div>
            <button
                onClick={onPick}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${isPicking
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                style={isPicking ? { backgroundColor: activeColor } : {}}
            >
                {isPicking ? 'Click map...' : point ? 'Change' : 'Set'}
            </button>
        </div>
    );
}
