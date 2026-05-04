import type { Category } from "../../types";

interface Props {
    selectedCount: number;
    totalCount: number;
    availableCategories: Category[];
    selectedCategories: Set<string>;
    toggleCategory: (id: string) => void;
    categoryCounts: Map<string, number>;
}

export default function CategoryList({
    selectedCount,
    totalCount,
    availableCategories,
    selectedCategories,
    toggleCategory,
    categoryCounts,
}: Props) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs text-gray-400 mb-2">
                {selectedCount} of {totalCount} places selected
            </p>
            {availableCategories.map(cat => {
                const isSelected = selectedCategories.has(cat.id);
                const count = categoryCounts.get(cat.id) || 0;
                return (
                    <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${isSelected
                            ? 'bg-white border-l-4 shadow-sm'
                            : 'bg-white/50 border-gray-100 hover:bg-white/75'
                            }`}
                        style={isSelected ? { borderLeftColor: cat.color } : {}}
                    >
                        <div
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${isSelected ? 'text-white' : 'text-gray-400'
                                }`}
                            style={isSelected ? { backgroundColor: cat.color, color: 'white' } : {}}
                        >
                            {isSelected && cat.icon ? (
                                <span dangerouslySetInnerHTML={{ __html: cat.icon }} />
                            ) : isSelected ? (
                                '✓'
                            ) : cat.icon ? (
                                <span style={{ color: cat.color }} dangerouslySetInnerHTML={{ __html: cat.icon }} />
                            ) : ''}
                        </div>
                        <span className={`flex-1 text-left font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                            {cat.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-50 text-[#00A8E8] font-semibold' : 'bg-gray-100 text-gray-400'}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
