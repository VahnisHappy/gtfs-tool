export type RouteCardProps = {
    route: {
        id: { value: string };
        name: { value: string };
    };
    index: number;
    isSelected: boolean;
    onSelect: () => void;

} 

export default function RouteCard({ route, index, isSelected, onSelect }: RouteCardProps) {
    const isEmpty = !route.id.value && !route.name.value;

    return (
        // <div>
        //     <li key={route.id.value}>{route.name.value}</li>
        // </div>
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
                        {isEmpty ? (
                            <span className="text-gray-400 italic">
                                New Route (unsaved)
                            </span>
                        ) : (
                            <>
                            <span className="font-semibold text-gray-900">
                            {route.id.value}
                            </span>
                            <span className="text-gray-900">
                                {route.name.value}
                            </span>
                            </>
                        )
                    }
                    </div>

                </div>
            </div>

        </li>
    )
}