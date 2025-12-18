export type StopCardProps = {
    stop: {
        id: { value: string };
        name: { value: string };
    };
    index: number;
    isSelected: boolean;
    onSelect: () => void;
}

export default function StopCard({ stop, index, isSelected, onSelect }: StopCardProps) {
    return (
        <li
            onClick={onSelect}
            className={`px-2 py-1 cursor-pointer transition-colors border-b border-gray-200  ${
                isSelected
                    ? 'bg-blue-50'
                    : 'bg-white hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-baseline gap-4">
                        <span className="font-semibold text-gray-900">
                            {stop.id.value}
                        </span>
                        <span className="text-gray-900">
                            {stop.name.value}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
};