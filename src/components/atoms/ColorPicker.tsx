export type ColorPickerProps = {
    color: string;
    onChange: () => void;
    value?: string;
}

export default function ColorPicker({ color, onChange }: { color: string; onChange: (color: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">route color</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    />
                 <span className="text-sm font-mono">{color.toUpperCase()}</span>
            </div>
        </div>
    )
}